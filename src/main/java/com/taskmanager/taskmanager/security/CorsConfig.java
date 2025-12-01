package com.taskmanager.taskmanager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();

        // ***** ORIGINEA FRONTEND-ULUI (React) *****
        config.setAllowedOrigins(List.of("http://localhost:5174"));

        // ***** METODE PERMISE *****
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ***** HEADERS PERMISE *****
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // ***** PERMITEM COOKIE/SESSION (pentru Basic Auth TEMPORAR) *****
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
