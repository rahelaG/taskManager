package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.service.TaskService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskRestController {

    private final TaskService taskService;

    public TaskRestController(TaskService taskService) {
        this.taskService = taskService;
    }

    //  1. TASK-URILE UTILIZATORULUI (ROLE_USER)
    @GetMapping("/tasks")
    public List<Task> getUserTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            Authentication authentication
    ) {
        String username = authentication.getName();

        // dacă vin stringuri goale, le transformăm în null (ca să meargă bine filtrarea)
        String statusOrNull = normalize(status);
        String prioritateOrNull = normalize(prioritate);
        String categorieOrNull = normalize(categorie);

        return taskService.filterTasks(statusOrNull, prioritateOrNull, categorieOrNull, username);
    }

    //  2. TASK-URILE PENTRU EDITOR (ROLE_EDITOR) - vede toate task-urile, nu doar ale lui
    @GetMapping("/editor/tasks")
    public List<Task> getEditorTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie
    ) {
        String statusOrNull = normalize(status);
        String prioritateOrNull = normalize(prioritate);
        String categorieOrNull = normalize(categorie);

        return taskService.filterTasksForEditor(statusOrNull, prioritateOrNull, categorieOrNull);
    }

    // Metodă helper pentru a transforma stringuri goale în null
    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
