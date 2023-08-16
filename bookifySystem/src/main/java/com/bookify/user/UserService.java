package com.bookify.user;

import com.bookify.authentication.TokenService;
import com.bookify.configuration.Configuration;
import com.bookify.images.Image;
import com.bookify.images.ImageRepository;
import com.bookify.registration.LoginRegistrationResponseDTO;
import com.bookify.registration.RegistrationDTO;
import com.bookify.reviews.Review;
import com.bookify.reviews.ReviewRepository;
import com.bookify.role.Role;
import com.bookify.role.RoleRepository;
import com.bookify.utils.Constants;
import com.bookify.utils.InappropriatePasswordException;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ReviewRepository reviewRepository;
    private final ImageRepository imageRepository;
    private final TokenService tokenService;

    public User createUser(RegistrationDTO registrationDTO) throws OperationNotSupportedException {
        String username = registrationDTO.username();

        checkUsernameAndEmailValidity(username, registrationDTO.email(), "", "");
        checkPasswordValidity(registrationDTO.password());

        String encodedPassword = passwordEncoder.encode(registrationDTO.password());

        Set<Role> roles = createRoleSet(registrationDTO.preferredRoles(), new HashSet<>());
        Image defaultImage = imageRepository.findByImageGuid(Configuration.DEFAULT_PROFILE_PIC_NAME).get();

        return userRepository.save(new User(
                username,
                registrationDTO.firstName(),
                registrationDTO.lastName(),
                registrationDTO.email(),
                registrationDTO.phoneNumber(),
                encodedPassword,
                defaultImage,
                roles));
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(usernameOrEmail);

        if(user.isPresent()) return user.get();

        return userRepository.findByEmail(usernameOrEmail).orElseThrow(() -> new UsernameNotFoundException(
                "Username/Email " + usernameOrEmail +" does not exist"));
    }

    public Optional<User> loadUserOptionalByUsernameOrEmail(String usernameOrEmail){
        Optional<User> user = userRepository.findByUsername(usernameOrEmail);

        if(user.isPresent()) return user;
        return userRepository.findByEmail(usernameOrEmail);
    }

    public User loadUserDataByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User " + username + " does not exist"));
    }

    public UserResponseDTO loadUserData(String username) throws UsernameNotFoundException {
        User user = loadUserDataByUsername(username.trim());
        return new UserResponseDTO(
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRolePreference()
        );
    }

    public UserStatsDTO loadUserStats(String username) throws UsernameNotFoundException {
        User user = loadUserDataByUsername(username.trim());
        return new UserStatsDTO(
                user.getAboutInfo(),
                user.getMemberSince(),
                reviewRepository.countByReviewerUsername(user.getUsername())
        );
    }


    public LoginRegistrationResponseDTO updateUser(UpdateUserProfileDTO newProfile) throws UsernameNotFoundException,
            OperationNotSupportedException {
        User user = userRepository.findByUsername(newProfile.oldUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User " + newProfile.oldUsername() + " does not exist"));

        checkUsernameAndEmailValidity(newProfile.newUsername(), newProfile.email(), user.getUsername(), user.getEmail());

        user.setUsername(newProfile.newUsername());
        user.setFirstName(newProfile.firstName());
        user.setLastName(newProfile.lastName());
        user.setEmail(newProfile.email());
        user.setPhoneNumber(newProfile.phoneNumber());
        if(!user.isAdmin())
            user.setRoles(createRoleSet(newProfile.preferredRoles(), user.getRoles()));

        userRepository.save(user);

        // Generate and return a new token as user info is updated
        String newAccessToken = generateNewJWTToken(user);

        return new LoginRegistrationResponseDTO(
                newProfile.newUsername(),
                newAccessToken,
                user.getRefreshToken().getToken(),
                user.getRoleAuthorityList());
    }

    public void updateUserAboutInfo(UpdateUserAboutDTO newAbout) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(newAbout.username())
                .orElseThrow(() -> new UsernameNotFoundException("User " + newAbout.username() + " does not exist"));

        user.setAboutInfo(newAbout.aboutInfo());
        userRepository.save(user);
    }

    public void deleteUser(String username) throws UsernameNotFoundException, UnsupportedOperationException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User " + username + " does not exist"));

        if(user.isAdmin()) throw new UnsupportedOperationException("Can not delete admin user");

        List<Review> reviews = reviewRepository.findAllByReviewerUserID(user.getUserID());
        for(Review review : reviews)
            review.setReviewer(null);

        reviewRepository.saveAll(reviews);

        userRepository.delete(user);
    }

    public LoginRegistrationResponseDTO changePassword(ChangePasswordDTO changePasswordDTO)
            throws UsernameNotFoundException, OperationNotSupportedException, IllegalAccessException {
        User user = userRepository.findByUsername(changePasswordDTO.username())
                .orElseThrow(() -> new UsernameNotFoundException("User " + changePasswordDTO.username() + " does not exist"));

        String encodedOldPassword = passwordEncoder.encode(changePasswordDTO.oldPassword());
        String encodedNewPassword = passwordEncoder.encode(changePasswordDTO.newPassword());

        if(!passwordEncoder.matches(changePasswordDTO.oldPassword(), user.getPassword()))
            throw new IllegalAccessException("Old password is not correct");

        if(changePasswordDTO.newPassword().equals(changePasswordDTO.oldPassword()))
            throw new OperationNotSupportedException("New password can not be the same as old password");

        checkPasswordValidity(changePasswordDTO.newPassword());

        user.setPassword(encodedNewPassword);
        userRepository.save(user);

        return new LoginRegistrationResponseDTO(
                changePasswordDTO.username(),
                generateNewJWTToken(user),
                user.getRefreshToken().getToken(),
                user.getRoleAuthorityList());
    }

    private void checkUsernameAndEmailValidity(String newUsername, String newEmail, String oldUsername, String oldEmail) {
        Optional<User> userOptional = userRepository.findByUsername(newUsername);
        if(userOptional.isPresent() && !userOptional.get().getUsername().equals(oldUsername))
            throw new IllegalArgumentException("Username " + newUsername + " is taken");

        userOptional = userRepository.findByEmail(newEmail);
        if(userOptional.isPresent() && !userOptional.get().getEmail().equals(oldEmail))
            throw new IllegalArgumentException("Email " + newEmail + " is taken");
    }

    private Set<Role> createRoleSet(String preferredRoles, Set<Role> previousRoles) throws OperationNotSupportedException {
        Role tenantRole = roleRepository.findByAuthority(Constants.TENANT_ROLE).get();
        Role inactiveHostRole = roleRepository.findByAuthority(Constants.INACTIVE_HOST_ROLE).get();
        Role hostRole = roleRepository.findByAuthority(Constants.HOST_ROLE).get();

        Set<Role> roles = new HashSet<>();

        switch (preferredRoles) {
            case Constants.TENANT_ROLE -> roles.add(tenantRole);
            case Constants.HOST_ROLE -> {
                if(previousRoles.contains(hostRole))
                    roles.add(hostRole);
                else
                    roles.add(inactiveHostRole);
            }
            case Constants.HOST_TENANT_PREF_ROLE -> {
                roles.add(tenantRole);

                if(previousRoles.contains(hostRole))
                    roles.add(hostRole);

                else
                    roles.add(inactiveHostRole);
            }
            default -> throw new OperationNotSupportedException("Unknown preferred role");
        }

        return roles;
    }

    private void checkPasswordValidity(String password){
        if(password.length() < Configuration.MIN_PASSWORD_LENGTH)
            throw new InappropriatePasswordException("Password too short");
    }

    //TODO: maybe move this to a more appropriate place
    private String generateNewJWTToken(User user){
        Authentication updatedAuth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(updatedAuth);
        return tokenService.generateJWTToken(updatedAuth);
    }
}