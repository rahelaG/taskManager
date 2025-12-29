package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.TaskRequest;
import com.taskmanager.taskmanager.entity.Project;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.service.ProjectService;
import com.taskmanager.taskmanager.service.TaskService;
import com.taskmanager.taskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskRestController {

    private final TaskService taskService;
    private final ProjectService projectService;
    private final UserService userService;

    public TaskRestController(TaskService taskService,
                              ProjectService projectService,
                              UserService userService) {
        this.taskService = taskService;
        this.projectService = projectService;
        this.userService = userService;
    }

    // =========================
    // 1. TASK-URILE USERULUI
    // =========================
    @GetMapping("/tasks")
    public List<Task> getUserTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            Authentication authentication
    ) {
        String username = authentication.getName();

        return taskService.filterTasks(
                normalize(status),
                normalize(prioritate),
                normalize(categorie),
                username
        );
    }

    // =========================
    // 2. TASK-URILE EDITORULUI
    // =========================
    @GetMapping("/editor/tasks")
    public List<Task> getEditorTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie
    ) {
        return taskService.filterTasksForEditor(
                normalize(status),
                normalize(prioritate),
                normalize(categorie)
        );
    }

    // =========================
    // 3. GET TASK BY ID (CU VERIFICARE PROJECT)
    // =========================
    @GetMapping("/editor/tasks/{id}")
    public ResponseEntity<Task> getTaskById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Task task = taskService.findById(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        String username = authentication.getName();
        User editor = userService.findByUsername(username);

        Project project = projectService.getProjectById(
                task.getProjectId(),
                editor.getId(),
                editor.getRol()
        );

        if (project == null) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(task);
    }

    // =========================
    // HELPER
    // =========================
    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    // =========================
    // 4. CREATE TASK
    // =========================
    @PostMapping("/editor/tasks")
    public Task createTask(
            @Valid @RequestBody TaskRequest dto,
            Authentication authentication
    ) {
        String username = authentication.getName();
        User editor = userService.findByUsername(username);

        // 🔒 verificam ca editorul gestioneaza project-ul
        Project project = projectService.getProjectById(
                dto.getProjectId(),
                editor.getId(),
                editor.getRol()
        );

        if (project == null) {
            throw new RuntimeException("You are not allowed to add tasks to this project");
        }

        Task task = new Task();
        task.setTitlu(dto.getTitlu());
        task.setDescriere(dto.getDescriere());
        task.setStatus(dto.getStatus());
        task.setPrioritate(dto.getPrioritate());
        task.setCategorie(dto.getCategorie());
        task.setIdCreator(dto.getIdCreator());
        task.setProjectId(dto.getProjectId());
        task.setDataCreare(LocalDate.now());

        return taskService.save(task);
    }

    // =========================
    // 5. UPDATE TASK
    // =========================
    @PutMapping("/editor/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {

        Task existing = taskService.findById(id);
        if (existing == null) return null;

        updatedTask.setId(id);
        updatedTask.setDataCreare(existing.getDataCreare());
        updatedTask.setProjectId(existing.getProjectId());

        return taskService.update(updatedTask);
    }

    // =========================
    // 6. DELETE TASK
    // =========================
    @DeleteMapping("/editor/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.delete(id);
    }

    // =========================
    // 7. ASSIGN TASK
    // =========================
    @PostMapping("/editor/tasks/{id}/assign")
    public Task assignTask(@PathVariable Long id, @RequestParam Long userId) {
        Task task = taskService.findById(id);
        if (task == null) return null;

        task.setIdCreator(userId);
        return taskService.update(task);
    }
}
