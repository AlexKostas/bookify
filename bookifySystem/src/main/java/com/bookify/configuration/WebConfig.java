package com.bookify.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// This file redirects static page requests to the root so the different links
// will be handled by the react router and not the spring static server
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:[\\w-]+}")
                .setViewName("forward:/");
        registry.addViewController("/**/{spring:[\\w-]+}")
                .setViewName("forward:/");
        registry.addViewController("/{spring:[\\w-]+}/**{spring:?!(\\.js|\\.css)$}")
                .setViewName("forward:/");
    }
}