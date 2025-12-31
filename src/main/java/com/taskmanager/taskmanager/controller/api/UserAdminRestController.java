package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.EditorResponse;
import com.taskmanager.taskmanager.exception.ForbiddenException;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserAdminRestController {

    private final UserService userService;

    public UserAdminRestController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // ADMIN – get editors (R6)
    // =========================
    @GetMapping("/editors")
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
}
