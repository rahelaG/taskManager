package com.taskmanager.taskmanager.controller;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.service.TaskService;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping("/tasks")
    public String listTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            Authentication authentication,
            Model model
    ) {
        // User logat
        String username = authentication.getName();
        model.addAttribute("username", username);

        // Filtrare dinamică
        List<Task> tasks = taskService.filterTasks(status, prioritate, categorie);
        model.addAttribute("tasks", tasks);

        // Construim mesajul de filtrare
        StringBuilder message = new StringBuilder("Toate task-urile");

        if (status != null && !status.isEmpty()) {
            message.append(" cu status = ").append(status);
        }
        if (prioritate != null && !prioritate.isEmpty()) {
            message.append(" și prioritate = ").append(prioritate);
        }
        if (categorie != null && !categorie.isEmpty()) {
            message.append(" și categorie = ").append(categorie);
        }

        model.addAttribute("filterMessage", message.toString());

        return "tasks-user"; // numele paginii HTML
    }
}
