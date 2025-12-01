package com.taskmanager.taskmanager.controller;

import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.service.TaskService;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final TaskService taskService;

    public AdminController(UserService userService, TaskService taskService) {
        this.userService = userService;
        this.taskService = taskService;
    }

    /**
     * Pagina HTML de listare a userilor (Thymeleaf).
     * TODO (Phase 4): Va fi înlocuită de React <AdminUsersPage>,
     * care va folosi API-ul /api/admin/users.
     */
    @GetMapping("/users")
    public String listUsers(Model model, Authentication authentication) {
        model.addAttribute("username", authentication.getName());
        model.addAttribute("users", userService.findAllUsers());
        return "admin-users";
    }

    /**
     * Formular creare user (Thymeleaf).
     * TODO (Phase 4): Crearea userilor va fi făcută din React via /api/admin/users (POST).
     */
    @GetMapping("/user/create")
    public String createUserForm(Model model, Authentication authentication) {
        model.addAttribute("username", authentication.getName());
        model.addAttribute("user", new User());
        return "admin-user-create";
    }

    @PostMapping("/user/save")
    public String saveUser(@ModelAttribute User user) {
        userService.saveUser(user);
        return "redirect:/admin/users";
    }

    /**
     * Formular editare user (Thymeleaf).
     * TODO (Phase 4): Editarea va fi mutată în React și va folosi /api/admin/users/{id} (PUT).
     */
    @GetMapping("/user/edit/{id}")
    public String editUserForm(@PathVariable Long id, Model model, Authentication authentication) {
        model.addAttribute("username", authentication.getName());
        model.addAttribute("user", userService.findById(id));
        return "admin-user-edit";
    }

    @PostMapping("/user/update")
    public String updateUser(@ModelAttribute User user) {
        userService.updateUser(user);
        return "redirect:/admin/users";
    }

    @PostMapping("/user/reset-password")
    public String resetPassword(
            @RequestParam Long id,
            @RequestParam String newPassword
    ) {
        userService.changePassword(id, newPassword);
        return "redirect:/admin/users";
    }

    @GetMapping("/user/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "redirect:/admin/users";
    }

    /**
     * Pagina dashboard admin (Thymeleaf).
     * TODO (Phase 4): Va fi înlocuită de React <AdminDashboardPage>,
     * care va folosi API-uri pentru statistici.
     */
    @GetMapping("/dashboard")
    public String dashboard(Model model, Authentication authentication) {

        model.addAttribute("username", authentication.getName());

        model.addAttribute("totalUsers", userService.findAllUsers().size());
        model.addAttribute("totalTasks", taskService.findAll().size());
        model.addAttribute("tasksTodo", taskService.countByStatus("TODO"));
        model.addAttribute("tasksInProgress", taskService.countByStatus("IN_PROGRESS"));
        model.addAttribute("tasksDone", taskService.countByStatus("DONE"));

        return "admin-dashboard";
    }

}
