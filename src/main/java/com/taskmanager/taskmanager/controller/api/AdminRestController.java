package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.AdminCreateUserRequest;
import com.taskmanager.taskmanager.dto.AdminDashboardResponse;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.service.TaskService;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRestController {

    private final UserService userService;
    private final TaskService taskService;

    public AdminRestController(UserService userService, TaskService taskService) {
        this.userService = userService;
        this.taskService = taskService;
    }

    // -------------------------
    // GET ALL USERS
    // -------------------------
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    // -------------------------
    // GET USER BY ID
    // -------------------------
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User u = userService.findById(id);
        if (u == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(u);
    }

    // -------------------------
    // CREATE USER
    // -------------------------
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody AdminCreateUserRequest req) {

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
    @PutMapping("/users/{id}")
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
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // -------------------------
    // RESET PASSWORD
    // -------------------------
    @PutMapping("/users/{id}/password")
    public ResponseEntity<String> resetPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> req
    ) {
        String newPassword = req.get("newPassword");

        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Password cannot be empty");
        }

        userService.changePassword(id, newPassword);
        return ResponseEntity.ok("Password updated");
    }

    // -------------------------
    // ⭐ DASHBOARD
    // -------------------------
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {

        AdminDashboardResponse response = new AdminDashboardResponse();

        response.setTotalUsers(userService.findAllUsers().size());
        response.setTotalTasks(taskService.findAll().size());
        response.setTasksTodo(taskService.countByStatus("TODO"));
        response.setTasksInProgress(taskService.countByStatus("IN_PROGRESS"));
        response.setTasksDone(taskService.countByStatus("DONE"));

        return ResponseEntity.ok(response);
    }
}
