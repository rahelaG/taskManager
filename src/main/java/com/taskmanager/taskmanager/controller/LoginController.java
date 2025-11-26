package com.taskmanager.taskmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    /**
     * Mapeaza cererea GET catre /login si returneaza pagina HTML de login.
     * @return Numele fisierului HTML (login.html)
     */
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
}