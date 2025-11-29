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

    // PASSWORD ENCODER
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AUTH MANAGER
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // SECURITY FILTER CHAIN
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // ✔ CSRF OFF pentru API (Postman + React)
                .csrf(csrf -> csrf.disable())

                // ✔ Autorizații
                .authorizeHttpRequests(auth -> auth

                        // ------- PUBLIC -------
                        .requestMatchers("/login", "/do-login", "/register",
                                "/css/**", "/js/**", "/images/**")
                        .permitAll()

                        // ------- HTML USER -------
                        .requestMatchers("/tasks/**")
                        .hasAnyRole("USER", "EDITOR", "ADMIN")

                        // ------- HTML EDITOR -------
                        .requestMatchers("/editor/**")
                        .hasAnyRole("EDITOR", "ADMIN")

                        // ------- HTML ADMIN -------
                        .requestMatchers("/admin/**")
                        .hasRole("ADMIN")

                        // ------- API ADMIN -------
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        // ------- API EDITOR -------
                        .requestMatchers("/api/editor/**")
                        .hasRole("EDITOR")

                        // ------- API USER (fallback) -------
                        .requestMatchers("/api/**")
                        .authenticated()

                        // TOT CE RAMANE -> AUTENTIFICAT
                        .anyRequest()
                        .authenticated()
                )

                // ⭐ IMPORTANT: httpBasic trebuie înainte de formLogin
                .httpBasic(withDefaults())

                // ⭐ Legăm CustomUserDetailsService pentru autentificare corectă
                .userDetailsService(customUserDetailsService)

                // ✔ Login pentru HTML cu formLogin
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/do-login")
                        .defaultSuccessUrl("/redirectByRole", true)
                        .failureUrl("/login?error=true")
                        .permitAll()
                )

                // ✔ Logout
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout=true")
                        .permitAll()
                );

        return http.build();
    }
}
