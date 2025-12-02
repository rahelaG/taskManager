package com.taskmanager.taskmanager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();

        // ORIGINEA FRONTEND-ULUI
        config.addAllowedOrigin("http://localhost:5173");

        // PERMITEM TOATE HEADERELE
        config.addAllowedHeader("*");

        // PERMITEM TOATE METODELE
        config.addAllowedMethod("*");

        // PERMITEM COOKIE-URI / SESIUNI
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
