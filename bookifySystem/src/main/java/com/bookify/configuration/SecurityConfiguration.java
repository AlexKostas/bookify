package com.bookify.configuration;

import com.bookify.authentication.KeyProperties;
import com.bookify.user.UserRepository;
import com.bookify.utils.Constants;
import com.bookify.authentication.UserNotDeletedFilter;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.servlet.Filter;
import lombok.AllArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;


@Configuration
@EnableScheduling
@AllArgsConstructor
public class SecurityConfiguration {

    private final KeyProperties keys;
    private final UserRepository userRepository;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.csrf(csrf -> csrf.disable()).
                authorizeHttpRequests(auth -> {
                    auth.requestMatchers(new AntPathRequestMatcher("/**", HttpMethod.OPTIONS.name())).permitAll();
                    auth.requestMatchers("/api/upload/**").permitAll();
                    auth.requestMatchers("/api/registration/**").permitAll();
                    auth.requestMatchers("/api/room/**").permitAll();
                    auth.requestMatchers("/api/amenities/**").permitAll();
                    auth.requestMatchers("/api/roomPhotos/**").permitAll();
                    auth.requestMatchers("/api/search/**").permitAll();
                    auth.requestMatchers("/api/reviews/**").permitAll();
                    auth.requestMatchers("/api/book/**").permitAll();
                    auth.requestMatchers("/api/roomType/**").permitAll();
                    auth.requestMatchers("/api/admin/**").hasRole(Constants.ADMIN_ROLE);
                    auth.requestMatchers("/api/messages").authenticated();
                    auth.requestMatchers("/api/user/**").permitAll();
                    auth.requestMatchers("/api/recommendation/**").permitAll();
                    auth.anyRequest().permitAll();
                }).
            oauth2ResourceServer().jwt().jwtAuthenticationConverter(jwtAuthenticationConverter());
        http.sessionManagement(session-> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));


        return http.build();
    }

    // Adds our custom UserNotDeleted filter to the Security Filter Chain AFTER all of Spring Security's filters
    @Bean
    public FilterRegistrationBean<Filter> afterAuthFilterRegistrationBean() {
        FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();

        // Register our custom filter
        UserNotDeletedFilter afterAuthFilter = new UserNotDeletedFilter(userRepository);
        registrationBean.setFilter(afterAuthFilter);

        //CAUTION: this needs to be a number greater than than spring.security.filter.order
        registrationBean.setOrder(30);
        return registrationBean;
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService detailsService){
        DaoAuthenticationProvider daoProvider = new DaoAuthenticationProvider();
        daoProvider.setUserDetailsService(detailsService);
        daoProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(daoProvider);
    }

    @Bean
    public JwtEncoder jwtEncoder(){
        JWK jwk = new RSAKey.Builder(keys.getPublicKey()).privateKey(keys.getPrivateKey()).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    public JwtDecoder jwtDecoder(){
        return NimbusJwtDecoder.withPublicKey(keys.getPublicKey()).build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtConverter;
    }
}
