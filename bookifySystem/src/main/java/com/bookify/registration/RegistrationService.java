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

    private UserService userService;
    private AuthenticationManager authenticationManager;
    private TokenService tokenService;

    public String registerUser(RegistrationDTO registrationDTO) throws OperationNotSupportedException,
            IllegalArgumentException, InappropriatePasswordException {

        return userService.createUser(registrationDTO).getUsername();
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
