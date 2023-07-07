package com.bookify.registration;

import com.bookify.authentication.TokenService;
import com.bookify.role.Role;
import com.bookify.role.RoleRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;
import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
@AllArgsConstructor
public class RegistrationService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private TokenService tokenService;

    public User registerUser(RegistrationDTO registrationDTO) throws OperationNotSupportedException {
        String encodedPassword = passwordEncoder.encode(registrationDTO.password());
        //TODO: convert strings to constants
        Role tenantRole = roleRepository.findByAuthority("tenant").get();
        Role inactiveHostRole = roleRepository.findByAuthority("inactive-host").get();

        Set<Role> roles = new HashSet<>();

        if(registrationDTO.preferredRoles().equals("tenant"))
            roles.add(tenantRole);
        else if(registrationDTO.preferredRoles().equals("host"))
            roles.add(inactiveHostRole);
        else if(registrationDTO.preferredRoles().equals("host_tenant")){
            roles.add(tenantRole);
            roles.add(inactiveHostRole);
        }
        else
            throw new OperationNotSupportedException("Unknown preferred role");

        //TODO: do not return the whole user
        return userRepository.save(new User(0L, registrationDTO.username(),
                registrationDTO.firstName(),
                registrationDTO.lastName(),
                registrationDTO.email(),
                registrationDTO.phoneNumber(),
                encodedPassword,
                roles));
    }

    public LoginResponseDTO loginUser(LoginDTO loginDTO){
        try{
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginDTO.username(), loginDTO.password()
            ));

            String token = tokenService.GenerateJWTToken(auth);

            return new LoginResponseDTO(userRepository.findByUsername(loginDTO.username()).get(),
                    token);
        }
        catch (AuthenticationException e){
            //TODO: Throw proper http response message
            //TODO: try to authenticate with email
            return new LoginResponseDTO(null, "");
        }
    }
}
