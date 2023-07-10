package com.bookify.user;

import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private PasswordEncoder encoder;
    private UserRepository userRepository;

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
                user.getRolesAsString()
        );
    }

    //TODO: add support to change preferred roles
    public void updateUser(UpdateUserProfileDTO newProfile) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(newProfile.oldUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User " + newProfile.oldUsername() + " does not exist"));

        if(userRepository.findByUsername(newProfile.newUsername()).isPresent())
            throw new IllegalArgumentException("Username " + newProfile.newUsername() + " is taken");

        if(userRepository.findByEmail(newProfile.email()).isPresent())
            throw new IllegalArgumentException("Email " + newProfile.email() + " is taken");

        user.setUsername(newProfile.newUsername());
        user.setFirstName(newProfile.firstName());
        user.setLastName(newProfile.lastName());
        user.setEmail(newProfile.email());
        user.setPhoneNumber(newProfile.phoneNumber());

        userRepository.save(user);
    }

    public void deleteUser(String username) throws UsernameNotFoundException, UnsupportedOperationException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User " + username + " does not exist"));

        if(user.isAdmin()) throw new UnsupportedOperationException("Can not delete admin user");

        userRepository.delete(user);
    }
}