package com.taskmanager.taskmanager.security;

import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // Normalize username pentru siguranță
        username = username.trim().toLowerCase();

        User user = userRepository.findByUtilizator(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found!");
        }

        return new CustomUserDetails(user);
    }
}
