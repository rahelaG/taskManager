package com.taskmanager.taskmanager.controller;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.service.TaskService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/tasks")
    public String listTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            Authentication authentication,
            Model model
    ) {
        String username = authentication.getName();
        model.addAttribute("username", username);

        List<Task> tasks = taskService.filterTasks(status, prioritate, categorie, username);
        model.addAttribute("tasks", tasks);

        StringBuilder message = new StringBuilder("Toate task-urile tale");

        if (status != null && !status.isEmpty()) message.append(" cu status = ").append(status);
        if (prioritate != null && !prioritate.isEmpty()) message.append(" și prioritate = ").append(prioritate);
        if (categorie != null && !categorie.isEmpty()) message.append(" și categorie = ").append(categorie);

        model.addAttribute("filterMessage", message.toString());

        return "tasks-user";
    }
}
