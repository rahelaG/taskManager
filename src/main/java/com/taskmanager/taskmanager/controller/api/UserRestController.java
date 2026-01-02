package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.AdminCreateUserRequest;
import com.taskmanager.taskmanager.dto.AdminDashboardResponse;
import com.taskmanager.taskmanager.dto.EditorResponse;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.ForbiddenException;
import com.taskmanager.taskmanager.service.TaskService;
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
    private final TaskService taskService;

    public UserRestController(UserService userService, TaskService taskService) {
        this.userService = userService;
        this.taskService = taskService;
    }

    // =========================================================
    // ADMIN – USERS CRUD (VECHI din AdminRestController)
    // =========================================================

    // -------------------------
    // GET ALL USERS
    // -------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    // -------------------------
    // GET USER BY ID
    // -------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User u = userService.findById(id);
        if (u == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(u);
    }

    // -------------------------
    // CREATE USER
    // -------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/users")
    public ResponseEntity<User> createUser(@Valid @RequestBody AdminCreateUserRequest req) {

        User user = new User();
        user.setNume(req.getNume());
        user.setUtilizator(req.getUtilizator());
        user.setParola(req.getParola());
        user.setRol(req.getRol());

        return ResponseEntity.ok(userService.saveUser(user));
    }

    // -------------------------
    // UPDATE USER
    // -------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/users/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User newUserData
    ) {
        newUserData.setId(id);
        return ResponseEntity.ok(userService.updateUser(newUserData));
    }

    // -------------------------
    // DELETE USER
    // -------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // -------------------------
    // RESET PASSWORD
    // -------------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/users/{id}/password")
    public ResponseEntity<?> resetPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> req
    ) {
        String newPassword = req.get("newPassword");

        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("newPassword", "Password cannot be empty"));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("newPassword", "Password must be at least 6 characters long"));
        }

        userService.changePassword(id, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }

    // =========================================================
    // ADMIN – DASHBOARD (VECHI din AdminRestController)
    // =========================================================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {

        List<User> users = userService.findAllUsers();
        AdminDashboardResponse response = new AdminDashboardResponse();

        // total users
        response.setTotalUsers(users.size());

        // count by role
        response.setUsersRoleUser((int) users.stream().filter(u -> "ROLE_USER".equals(u.getRol())).count());
        response.setUsersRoleEditor((int) users.stream().filter(u -> "ROLE_EDITOR".equals(u.getRol())).count());
        response.setUsersRoleAdmin((int) users.stream().filter(u -> "ROLE_ADMIN".equals(u.getRol())).count());

        // last 5 users by ID desc (fără dată înregistrare)
        List<AdminDashboardResponse.LatestUser> latest =
                users.stream()
                        .sorted((a, b) -> b.getId().compareTo(a.getId()))
                        .limit(5)
                        .map(u -> {
                            AdminDashboardResponse.LatestUser dto = new AdminDashboardResponse.LatestUser();
                            dto.setId(u.getId());
                            dto.setNume(u.getNume());
                            dto.setUtilizator(u.getUtilizator());
                            dto.setRol(u.getRol());
                            return dto;
                        })
                        .toList();

        response.setLatestUsers(latest);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // ADMIN – GET EDITORS (VECHI din UserAdminRestController)
    // =========================================================
    @GetMapping("/users/editors")
    public List<EditorResponse> getEditors(Authentication authentication) {

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        if (!"ROLE_ADMIN".equals(role)) {
            throw new ForbiddenException("Only admins can view editors");
        }

        return userService.findEditors()
                .stream()
                .map(user -> new EditorResponse(
                        user.getId(),
                        user.getUtilizator()
                ))
                .toList();
    }

    // =========================================================
    // VIEW – USERS LIST (VECHI din UserViewRestController)
    // =========================================================
    @GetMapping("/users/all")
    public List<User> getAllUsersView() {
        return userService.findAllUsers();
    }
}
