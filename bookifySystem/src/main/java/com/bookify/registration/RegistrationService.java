package com.bookify.registration;

import com.bookify.authentication.TokenService;
import com.bookify.configuration.Configuration;
import com.bookify.role.Role;
import com.bookify.role.RoleRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.user.UserService;
import com.bookify.utils.Constants;
import com.bookify.utils.InappropriatePasswordException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
@AllArgsConstructor
public class RegistrationService {

    private UserRepository userRepository;
    private UserService userService;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private TokenService tokenService;

    //TODO: maybe move the main logic to the user service
    public String registerUser(RegistrationDTO registrationDTO) throws OperationNotSupportedException,
            IllegalArgumentException, InappropriatePasswordException {
        String username = registrationDTO.username();
        username = username.trim();

        if(userRepository.findByUsername(username).isPresent())
            throw new IllegalArgumentException("Username " + registrationDTO.username() + " is taken");

        if(userRepository.findByEmail(registrationDTO.email()).isPresent())
            throw new IllegalArgumentException("Email " + registrationDTO.email() + " is taken");

        if(registrationDTO.password().length() < Configuration.MIN_PASSWORD_LENGTH)
            throw new InappropriatePasswordException("Password too short");

        String encodedPassword = passwordEncoder.encode(registrationDTO.password());
        Role tenantRole = roleRepository.findByAuthority(Constants.TENANT_ROLE).get();
        Role inactiveHostRole = roleRepository.findByAuthority(Constants.INACTIVE_HOST_ROLE).get();

        Set<Role> roles = new HashSet<>();

        switch (registrationDTO.preferredRoles()) {
            case Constants.TENANT_ROLE -> roles.add(tenantRole);
            case Constants.HOST_ROLE -> roles.add(inactiveHostRole);
            case Constants.HOST_TENANT_PREF_ROLE -> {
                roles.add(tenantRole);
                roles.add(inactiveHostRole);
            }
            default -> throw new OperationNotSupportedException("Unknown preferred role");
        }

        userRepository.save(new User(0L, username,
                registrationDTO.firstName(),
                registrationDTO.lastName(),
                registrationDTO.email(),
                registrationDTO.phoneNumber(),
                encodedPassword,
                roles));

        return username;
    }

    public LoginResponseDTO loginUser(LoginDTO loginDTO) throws BadCredentialsException {
        try{
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginDTO.usernameOrEmail(), loginDTO.password()
            ));

            String token = tokenService.GenerateJWTToken(auth);

            Optional<User> user = userService.loadUserOptionalByUsernameOrEmail(loginDTO.usernameOrEmail());
            assert(user.isPresent());

            return new LoginResponseDTO(user.get().getUsername(), token);
        }
        catch (AuthenticationException e){
            throw new BadCredentialsException("Invalid credentials");
        }
    }
}
