package com.taskmanager.taskmanager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // ⭐ React needs CORS
                .cors(withDefaults())

                // ⭐ CSRF OFF temporarily (needed for API)
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // PUBLIC
                        .requestMatchers("/login", "/do-login", "/register",
                                "/css/**", "/js/**", "/images/**")
                        .permitAll()

                        // HTML USER
                        .requestMatchers("/tasks/**")
                        .hasAnyRole("USER", "EDITOR", "ADMIN")

                        // HTML EDITOR
                        .requestMatchers("/editor/**")
                        .hasAnyRole("EDITOR", "ADMIN")

                        // HTML ADMIN
                        .requestMatchers("/admin/**")
                        .hasRole("ADMIN")

                                // API ADMIN
                                .requestMatchers("/api/admin/**")
                                .hasRole("ADMIN")

// API EDITOR
                                .requestMatchers("/api/editor/**")
                                .hasAnyRole("EDITOR", "ADMIN")

// API USER - doar user normal
                                .requestMatchers("/api/tasks/**")
                                .hasRole("USER")

// orice API are nevoie de autentificare
                                .requestMatchers("/api/**")
                                .authenticated()


                                // fallback
                        .anyRequest()
                        .authenticated()
                )

                // ⭐ TEMPORARY: Basic Auth for Postman + React
                .httpBasic(withDefaults())

                // Conectăm user details
                .userDetailsService(customUserDetailsService)

                // ⭐ TEMPORARY: form login pentru HTML
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/do-login")
                        .defaultSuccessUrl("/redirectByRole", true)
                        .failureUrl("/login?error=true")
                        .permitAll()
                )

                // LOGOUT
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout=true")
                        .permitAll()
                );

        return http.build();
    }
}
