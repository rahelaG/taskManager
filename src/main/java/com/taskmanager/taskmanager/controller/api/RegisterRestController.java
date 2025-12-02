package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.RegisterRequest;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RegisterRestController {

    private final UserService userService;

    public RegisterRestController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {

        // mapăm DTO → ENTITY
        User user = new User();
        user.setNume(request.getNume());
        user.setUtilizator(request.getUsername().trim().toLowerCase());
        user.setParola(request.getPassword());
        user.setRol("ROLE_USER");

        userService.saveUser(user);

        return ResponseEntity.ok("User registered successfully");
    }
}
