//package com.bookify.configuration;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.filter.CorsFilter;
//
//@Configuration
//public class CorsConfig {
//    @Bean
//    public CorsFilter corsFilter() {
//        CorsConfiguration corsConfig = new CorsConfiguration();
//        corsConfig.addAllowedOrigin("*"); // Allow requests from any origin
//        corsConfig.addAllowedMethod("*"); // Allow all HTTP methods
//        corsConfig.addAllowedHeader("*"); // Allow all headers
//        corsConfig.setAllowCredentials(true); // Allow sending of cookies
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", corsConfig);
//
//        return new CorsFilter(source);
//    }
//}
