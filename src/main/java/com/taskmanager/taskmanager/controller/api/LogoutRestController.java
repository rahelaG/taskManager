package com.taskmanager.taskmanager.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogoutRestController {

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
        request.logout();        // si scoate userul din SecurityContext
        request.getSession().invalidate(); // sterge sesiunea
    }
}
