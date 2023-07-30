package com.bookify.authentication;

import com.bookify.configuration.Configuration;
import com.bookify.utils.Constants;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TokenService {

    private JwtEncoder jwtEncoder;

    public String generateJWTToken(Authentication authentication){
        String scope = authentication.getAuthorities().stream().
                map(GrantedAuthority::getAuthority).collect(Collectors.joining(" "));

        return generateJWTToken(scope, authentication.getName());
    }

    public String generateJWTToken(String scope, String name){
        Instant now = Instant.now();
        Instant expirationDate = now.plus(Configuration.ACCESS_TOKEN_DURATION_SECONDS, ChronoUnit.SECONDS);

        JwtClaimsSet claims = JwtClaimsSet.builder().
                issuer(Constants.JWT_ISSUER).
                issuedAt(now).
                expiresAt(expirationDate).
                subject(name).
                claim("roles", scope).
                build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
