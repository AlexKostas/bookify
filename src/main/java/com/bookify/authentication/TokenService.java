package com.bookify.authentication;

import com.bookify.utils.Constants;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TokenService {

    private JwtEncoder jwtEncoder;

    public String GenerateJWTToken(Authentication authentication){
        Instant now = Instant.now();

        String scope = authentication.getAuthorities().stream().
                map(GrantedAuthority::getAuthority).collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder().issuer(Constants.JWT_ISSUER).issuedAt(now).subject(authentication.getName()).
                claim("roles", scope).build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

    }
}
