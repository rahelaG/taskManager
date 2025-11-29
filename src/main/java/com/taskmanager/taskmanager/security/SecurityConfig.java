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
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Public
                        .requestMatchers("/login", "/register", "/css/**", "/js/**").permitAll()

                        // HTML User
                        .requestMatchers("/tasks/**")
                        .hasAnyRole("USER", "EDITOR", "ADMIN")

                        // HTML Editor
                        .requestMatchers("/editor/**")
                        .hasAnyRole("EDITOR", "ADMIN")

                        // HTML Admin
                        .requestMatchers("/admin/**")
                        .hasRole("ADMIN")

                        // API Editor
                        .requestMatchers("/api/editor/**")
                        .hasRole("EDITOR")

                        // API Admin
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        // API User (filtrare)
                        .requestMatchers("/api/**")
                        .authenticated()

                        .anyRequest().authenticated()
                )

                // 💥 BASIC AUTH trebuie PUS ÎNAINTE de formLogin
                .httpBasic(withDefaults())

                // ⭐ trebuie sa legam userDetailsService
                .userDetailsService(customUserDetailsService)


                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/do-login")
                        .defaultSuccessUrl("/redirectByRole", true)
                        .failureUrl("/login?error=true")
                        .permitAll()
                )


                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout=true")
                        .permitAll()
                );
        //http.httpBasic(withDefaults());

        return http.build();
    }
}
