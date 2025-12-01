package com.taskmanager.taskmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    /**
     * Pagina de login (Thymeleaf).
     * TODO (Phase 4): Va fi înlocuită de React <LoginPage>.
     */
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
}
