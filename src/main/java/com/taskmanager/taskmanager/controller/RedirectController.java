package com.taskmanager.taskmanager.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RedirectController {

    /**
     * Redirecționează userul în funcție de rol.
     * HTML version (Thymeleaf).
     * În viitor, React va face routing pe client, dar acest endpoint rămâne ca fallback.
     */
    @GetMapping("/redirectByRole")
    public String redirectByRole(Authentication auth) {

        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return "redirect:/admin/dashboard";
        }

        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_EDITOR"))) {
            return "redirect:/editor/tasks";
        }

        return "redirect:/tasks";
    }
}
