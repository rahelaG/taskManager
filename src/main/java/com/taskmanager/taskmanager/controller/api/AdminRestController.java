package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.AdminCreateUserRequest;
import com.taskmanager.taskmanager.dto.AdminDashboardResponse;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.entity.Task;
import java.util.Comparator;
import java.util.stream.Collectors;

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
    //  DASHBOARD
    // -------------------------
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {

        AdminDashboardResponse response = new AdminDashboardResponse();

        // luăm toate datele o singură dată
        List<User> users = userService.findAllUsers();
        List<Task> tasks = taskService.findAll();

        // totaluri simple
        response.setTotalUsers(users.size());
        response.setTotalTasks(tasks.size());
        response.setTasksTodo(taskService.countByStatus("TODO"));
        response.setTasksInProgress(taskService.countByStatus("IN_PROGRESS"));
        response.setTasksDone(taskService.countByStatus("DONE"));

        // --- USERS BY ROLE ---
        int roleUser = (int) users.stream()
                .filter(u -> "ROLE_USER".equals(u.getRol()))
                .count();

        int roleEditor = (int) users.stream()
                .filter(u -> "ROLE_EDITOR".equals(u.getRol()))
                .count();

        int roleAdmin = (int) users.stream()
                .filter(u -> "ROLE_ADMIN".equals(u.getRol()))
                .count();

        response.setUsersRoleUser(roleUser);
        response.setUsersRoleEditor(roleEditor);
        response.setUsersRoleAdmin(roleAdmin);

        // --- TASKS BY PRIORITY ---
        response.setPriorityHigh(taskService.countByPriority("HIGH"));
        response.setPriorityMedium(taskService.countByPriority("MEDIUM"));
        response.setPriorityLow(taskService.countByPriority("LOW"));

        // --- TOP USERS (după număr de taskuri asignate) ---
        Map<Long, Long> countsByUser = tasks.stream()
                .filter(t -> t.getIdCreator() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        Task::getIdCreator,
                        java.util.stream.Collectors.counting()
                ));

        List<AdminDashboardResponse.TopUser> topUsers = countsByUser.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(5)
                .map(entry -> {
                    User u = userService.findById(entry.getKey());
                    AdminDashboardResponse.TopUser dto = new AdminDashboardResponse.TopUser();
                    if (u != null) {
                        dto.setNume(u.getNume());
                        dto.setRol(u.getRol());
                    } else {
                        dto.setNume("Unknown");
                        dto.setRol("");
                    }
                    dto.setTotal(entry.getValue());
                    return dto;
                })
                .toList();

        response.setTopUsers(topUsers);

        // --- RECENT TASKS ---
        List<AdminDashboardResponse.RecentTask> recentTasks = tasks.stream()
                .sorted(java.util.Comparator.comparing(
                        Task::getDataCreare,
                        java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder())
                ).reversed())
                .limit(5)
                .map(t -> {
                    AdminDashboardResponse.RecentTask dto = new AdminDashboardResponse.RecentTask();
                    dto.setTitlu(t.getTitlu());
                    dto.setStatus(t.getStatus());
                    dto.setDataCreare(
                            t.getDataCreare() != null
                                    ? t.getDataCreare().toString()
                                    : ""
                    );
                    return dto;
                })
                .toList();

        response.setRecentTasks(recentTasks);

        return ResponseEntity.ok(response);
    }

}
