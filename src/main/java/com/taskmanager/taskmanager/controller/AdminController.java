package com.taskmanager.taskmanager.controller;

import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.service.TaskService;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final TaskService taskService;   // <-- AICI L-AM ADAUGAT

    public AdminController(UserService userService, TaskService taskService) {
        this.userService = userService;
        this.taskService = taskService;      // <-- SI AICI
    }

    // LISTARE USERI
    @GetMapping("/users")
    public String listUsers(Model model) {
        model.addAttribute("users", userService.findAllUsers());
        return "admin-users";
    }

    // FORMULAR CREARE USER
    @GetMapping("/user/create")
    public String createUserForm(Model model) {
        model.addAttribute("user", new User());
        return "admin-user-create";
    }

    // SALVARE USER NOU
    @PostMapping("/user/save")
    public String saveUser(@ModelAttribute User user) {
        userService.saveUser(user);
        return "redirect:/admin/users";
    }

    // FORMULAR EDITARE USER
    @GetMapping("/user/edit/{id}")
    public String editUserForm(@PathVariable Long id, Model model) {
        model.addAttribute("user", userService.findById(id));
        return "admin-user-edit";
    }

    // UPDATE USER
    @PostMapping("/user/update")
    public String updateUser(@ModelAttribute User user) {
        userService.updateUser(user);
        return "redirect:/admin/users";
    }

    // SCHIMBARE PAROLĂ
    @PostMapping("/user/reset-password")
    public String resetPassword(
            @RequestParam Long id,
            @RequestParam String newPassword
    ) {
        userService.changePassword(id, newPassword);
        return "redirect:/admin/users";
    }

    // ȘTERGERE USER
    @GetMapping("/user/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "redirect:/admin/users";
    }

    // DASHBOARD
    @GetMapping("/dashboard")
    public String dashboard(Model model) {

        model.addAttribute("totalUsers", userService.findAllUsers().size());

        model.addAttribute("totalTasks", taskService.findAll().size());
        model.addAttribute("tasksTodo", taskService.countByStatus("TODO"));
        model.addAttribute("tasksInProgress", taskService.countByStatus("IN_PROGRESS"));
        model.addAttribute("tasksDone", taskService.countByStatus("DONE"));

        return "admin-dashboard";
    }

}
