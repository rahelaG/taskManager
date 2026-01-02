package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.*;
import com.taskmanager.taskmanager.mapper.UserMapper;
import com.taskmanager.taskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // ADMIN – USERS CRUD
    // =========================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/users")
    public List<UserResponse> getAllUsers() {
        return userService.findAllUsers()
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/users/{id}")
    public UserResponse getUser(@PathVariable Long id) {
        return UserMapper.toResponse(userService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/users")
    public UserResponse createUser(
            @Valid @RequestBody AdminCreateUserRequest req
    ) {
        return UserMapper.toResponse(userService.createUser(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/users/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest req
    ) {
        return UserMapper.toResponse(userService.updateUser(id, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/users/{id}/password")
    public ResponseEntity<Void> resetPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> req
    ) {
        userService.changePassword(id, req.get("newPassword"));
        return ResponseEntity.ok().build();
    }

    // =========================
    // ADMIN – DASHBOARD
    // =========================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/dashboard")
    public AdminDashboardResponse getDashboardStats() {
        return userService.getAdminDashboard();
    }

    // =========================
    // ADMIN – EDITORS
    // =========================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/editors")
    public List<EditorResponse> getEditors() {
        return userService.findEditors()
                .stream()
                .map(u -> new EditorResponse(u.getId(), u.getUtilizator()))
                .toList();
    }

    // =========================
    // VIEW – USERS
    // =========================

    @GetMapping("/users/all")
    public List<UserResponse> getAllUsersView() {
        return userService.findAllUsers()
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }
}
