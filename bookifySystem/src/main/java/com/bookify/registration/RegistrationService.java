package com.bookify.registration;

import com.bookify.authentication.RefreshToken;
import com.bookify.authentication.RefreshTokenRepository;
import com.bookify.authentication.TokenService;
import com.bookify.configuration.Configuration;
import com.bookify.messages.MessageService;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.user.UserService;
import com.bookify.utils.GUIDGenerator;
import com.bookify.utils.InappropriatePasswordException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class RegistrationService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final MessageService messageService;

    private final RefreshTokenRepository refreshTokenRepository;

    public LoginRegistrationResponseDTO registerUser(RegistrationDTO registrationDTO) throws OperationNotSupportedException,
            IllegalArgumentException, InappropriatePasswordException {

        User newUser = userService.createUser(registrationDTO);
        String refreshToken = generateRefreshToken(newUser);

        String message = "Hello " + newUser.getFirstName() +",\n\n" + "welcome to bookify!";
        messageService.sendMessageFromAdmin(newUser.getUsername(), "Welcoming Message", message);

        return new LoginRegistrationResponseDTO(newUser.getUsername(), generateAccessToken(registrationDTO.username(),
                registrationDTO.password()), refreshToken, newUser.getRoleAuthorityList());
    }

    public LoginRegistrationResponseDTO loginUser(LoginDTO loginDTO) throws BadCredentialsException {
        try{
            String accessToken = generateAccessToken(loginDTO.usernameOrEmail(), loginDTO.password());

            Optional<User> user = userService.loadUserOptionalByUsernameOrEmail(loginDTO.usernameOrEmail());
            assert(user.isPresent());

            String refreshToken = generateRefreshToken(user.get());
            return new LoginRegistrationResponseDTO(user.get().getUsername(), accessToken, refreshToken, user.get().getRoleAuthorityList());
        }
        catch (AuthenticationException e){
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    public LoginRegistrationResponseDTO refresh(String refreshToken){
        RefreshToken token = refreshTokenRepository.findById(refreshToken)
                .orElseThrow(() -> new BadCredentialsException("Refresh token not found"));

        if(token.isExpired()) throw new CredentialsExpiredException("Refresh token has expired");

        User user = token.getUser();
        if(user == null) throw new BadCredentialsException("User assigned to this token has been removed");

        String newAccessToken = tokenService.generateJWTToken(user.getScope(), user.getUsername());
        return new LoginRegistrationResponseDTO(
                user.getUsername(),
                newAccessToken,
                refreshToken,
                user.getRoleAuthorityList());
    }

    public void logout(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByUsername(username);

        assert(userOptional.isPresent());
        User user = userOptional.get();

        assert(user.getRefreshToken() != null);
        refreshTokenRepository.delete(user.getRefreshToken());
        user.setRefreshToken(null);

        userRepository.save(user);
    }

    private String generateAccessToken(String username, String password){
        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                username, password
        ));

        return tokenService.generateJWTToken(auth);
    }

    private String generateRefreshToken(User user){
        String token;
        do {
            token = GUIDGenerator.GenerateGUID();
        } while(refreshTokenRepository.findById(token).isPresent());

        Instant expirationTime = Instant.now().plus(Configuration.REFRESH_TOKEN_DURATION_MINUTES, ChronoUnit.MINUTES);
        //TODO: maybe hash the refresh token in the future
        //TODO: maybe we should allow multiple refresh tokens for each user (logging in from different devices)
        RefreshToken newToken = new RefreshToken(token, expirationTime);

        if(user.getRefreshToken() != null)
            refreshTokenRepository.deleteById(user.getRefreshToken().getToken());

        user.replaceRefreshToken(newToken);
        userRepository.save(user);

        return newToken.getToken();
    }
}
