package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.RegisterRequest;
import com.taskmanager.taskmanager.service.UserService;
import jakarta.validation.Valid;
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
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegisterRequest request
    ) {
        userService.registerUser(request);
        return ResponseEntity.ok("User registered successfully");
    }
}
