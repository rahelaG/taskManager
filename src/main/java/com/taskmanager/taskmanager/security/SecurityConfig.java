package com.taskmanager.taskmanager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

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
                .cors(c -> {})
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/do-login", "/register",
                                "/css/**", "/js/**", "/images/**").permitAll()

                        .requestMatchers("/api/register").permitAll()

                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/editor/**").hasAnyRole("EDITOR", "ADMIN")
                        .requestMatchers("/api/tasks/**").hasRole("USER")

                        .requestMatchers("/api/**").authenticated()

                        .anyRequest().authenticated()
                )

                .exceptionHandling(e -> e
                        .authenticationEntryPoint((req, res, ex) -> res.setStatus(401))
                )


                // ❗ FOARTE IMPORTANT: fără Basic Auth !!!
                // .httpBasic(withDefaults())

                .formLogin(form -> form
                        .loginProcessingUrl("/do-login")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(200); // SUCCESS pentru React
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(401); // FAIL pentru React
                        })
                        .permitAll()
                )

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout=true")
                        .permitAll()
                )

                .userDetailsService(customUserDetailsService);

        return http.build();
    }
}

