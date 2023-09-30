package com.bookify.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Only necessary for development purposes. Left here in case someone wants to run a local npm development server
// so that the frontend will be allowed to communicate with the backend. Make sure the development server
// runs on localhost at port 3000.
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Access-Control-Allow-Origin")
                .allowCredentials(true);
    }
}
