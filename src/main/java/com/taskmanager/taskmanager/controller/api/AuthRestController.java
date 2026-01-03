package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.AuthResponse;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    private final UserService userService;

    public AuthRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.findByUtilizator(authentication.getName());

        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setUsername(user.getUtilizator());
        response.setNume(user.getNume());
        response.setRol(user.getRol().name());

        return ResponseEntity.ok(response);
    }
}
