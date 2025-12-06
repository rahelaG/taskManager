package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserViewRestController {

    private final UserService userService;

    public UserViewRestController(UserService userService) {
        this.userService = userService;
    }

    //  EDITOR + ADMIN pot vedea lista userilor
    @GetMapping("/users/all")
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }
}
