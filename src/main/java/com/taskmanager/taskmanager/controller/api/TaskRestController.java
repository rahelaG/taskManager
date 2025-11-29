package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.service.TaskService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/editor/tasks")
    public Task createTask(@RequestBody Task task) {
        return taskService.save(task);
    }

    @PutMapping("/editor/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task existing = taskService.findById(id);
        if (existing == null) return null;

        updatedTask.setId(id);
        return taskService.update(updatedTask);
    }
    @DeleteMapping("/editor/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.delete(id);
    }
    @PostMapping("/editor/tasks/{id}/assign")
    public Task assignTask(@PathVariable Long id, @RequestParam Long userId) {
        Task task = taskService.findById(id);
        if (task == null) return null;

        task.setIdCreator(userId);
        return taskService.update(task);
    }


}
