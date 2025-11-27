package com.taskmanager.taskmanager.controller;

import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class RegisterController {

    private final UserService userService;

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String processRegister(@ModelAttribute User user) {

        // Normalize username (evită situații când login-ul nu funcționează)
        user.setUtilizator(user.getUtilizator().trim().toLowerCase());

        // Toți userii noi au rol de bază
        user.setRol("ROLE_USER");

        userService.saveUser(user);

        return "redirect:/login?registered=true";
    }
}
