package com.bookify.registration;

import com.bookify.authentication.TokenService;
import com.bookify.user.User;
import com.bookify.user.UserService;
import com.bookify.utils.InappropriatePasswordException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class RegistrationService {

    private UserService userService;
    private AuthenticationManager authenticationManager;
    private TokenService tokenService;

    public LoginRegistrationResponseDTO registerUser(RegistrationDTO registrationDTO) throws OperationNotSupportedException,
            IllegalArgumentException, InappropriatePasswordException {

        return new LoginRegistrationResponseDTO(userService.createUser(registrationDTO).getUsername(),
                generateToken(registrationDTO.username(), registrationDTO.password()));

    }

    public LoginRegistrationResponseDTO loginUser(LoginDTO loginDTO) throws BadCredentialsException {
        try{
            String token = generateToken(loginDTO.usernameOrEmail(), loginDTO.password());

            Optional<User> user = userService.loadUserOptionalByUsernameOrEmail(loginDTO.usernameOrEmail());
            assert(user.isPresent());

            return new LoginRegistrationResponseDTO(user.get().getUsername(), token);
        }
        catch (AuthenticationException e){
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    private String generateToken(String username, String password){
        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                username, password
        ));

        return tokenService.GenerateJWTToken(auth);
    }
}
