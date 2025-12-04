package com.taskmanager.taskmanager.controller_archived;

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

    /**
     * Pagina de register (Thymeleaf).
     * TODO (Phase 4): Va fi înlocuită de React <RegisterPage>.
     */
    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    /**
     * Procesează formularul de înregistrare.
     * TODO (Phase 4): Logica va rămâne în backend, dar va fi apelată din React.
     */
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
