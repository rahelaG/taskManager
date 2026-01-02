package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.TaskRequest;
import com.taskmanager.taskmanager.dto.TaskResponse;
import com.taskmanager.taskmanager.service.TaskService;
import jakarta.validation.Valid;
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


    // USER – task-urile lui
    @GetMapping("/tasks")
    public List<TaskResponse> getUserTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            Authentication authentication
    ) {
        return taskService.getUserTaskResponses(
                status,
                prioritate,
                categorie,
                authentication.getName()
        );
    }

    // EDITOR – task-uri
    @GetMapping("/editor/tasks")
    public List<TaskResponse> getEditorTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            @RequestParam(required = false) Long projectId,
            Authentication authentication
    ) {
        return taskService.getEditorTaskResponses(
                status,
                prioritate,
                categorie,
                projectId,
                authentication.getName()
        );
    }

    // CREATE TASK
    @PostMapping("/editor/tasks")
    public TaskResponse createTask(
            @Valid @RequestBody TaskRequest dto,
            Authentication authentication
    ) {
        return taskService.createTask(dto, authentication.getName());
    }

    // GET TASK BY ID
    @GetMapping("/editor/tasks/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                taskService.getTaskByIdForEditor(id, authentication.getName())
        );
    }

    // UPDATE TASK
    @PutMapping("/editor/tasks/{id}")
    public TaskResponse updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest dto,
            Authentication authentication
    ) {
        return taskService.updateTask(id, dto, authentication.getName());
    }

    // DELETE TASK
    @DeleteMapping("/editor/tasks/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Authentication authentication
    ) {
        taskService.deleteTask(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    // ASSIGN TASK
    @PostMapping("/editor/tasks/{id}/assign")
    public TaskResponse assignTask(
            @PathVariable Long id,
            @RequestParam Long userId,
            Authentication authentication
    ) {
        return taskService.assignTask(id, userId, authentication.getName());
    }
}
