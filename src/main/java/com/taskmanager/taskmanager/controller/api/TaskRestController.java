package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.service.TaskService;
import org.springframework.http.ResponseEntity;
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

    // 1. TASK-URILE UTILIZATORULUI (ROLE_USER)
    @GetMapping("/tasks")
    public List<Task> getUserTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            Authentication authentication
    ) {
        String username = authentication.getName();

        String statusOrNull = normalize(status);
        String prioritateOrNull = normalize(prioritate);
        String categorieOrNull = normalize(categorie);

        return taskService.filterTasks(statusOrNull, prioritateOrNull, categorieOrNull, username);
    }

    // 2. TASK-URILE PENTRU EDITOR (vede toate task-urile)
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

    // 3. GET UN SINGUR TASK (necesar pentru pagina EditorTaskEditPage)
    @GetMapping("/editor/tasks/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.findById(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(task);
    }

    // HELPER: transformă stringurile goale în null
    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    // 4. CREATE
    @PostMapping("/editor/tasks")
    public Task createTask(@RequestBody Task task) {
        return taskService.save(task);
    }

    // 5. UPDATE
    @PutMapping("/editor/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task existing = taskService.findById(id);
        if (existing == null) return null;

        updatedTask.setId(id);
        return taskService.update(updatedTask);
    }

    // 6. DELETE
    @DeleteMapping("/editor/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.delete(id);
    }

    // 7. ASSIGN
    @PostMapping("/editor/tasks/{id}/assign")
    public Task assignTask(@PathVariable Long id, @RequestParam Long userId) {
        Task task = taskService.findById(id);
        if (task == null) return null;

        task.setIdCreator(userId);
        return taskService.update(task);
    }
}
