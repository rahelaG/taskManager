package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.dto.TaskRequest;
import com.taskmanager.taskmanager.dto.TaskResponse;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.ForbiddenException;
import com.taskmanager.taskmanager.mapper.TaskMapper;
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

    public TaskRestController(
            TaskService taskService,
            ProjectService projectService,
            UserService userService
    ) {
        this.taskService = taskService;
        this.projectService = projectService;
        this.userService = userService;
    }

    // =========================
    // USER – task-urile lui
    // =========================
    @GetMapping("/tasks")
    public List<TaskResponse> getUserTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            Authentication authentication
    ) {
        return taskService
                .getUserTasks(status, prioritate, categorie, authentication.getName())
                .stream()
                .map(TaskMapper::toResponse)
                .toList();
    }

    // =========================
    // EDITOR – task-uri (per proiect)
    // =========================
    @GetMapping("/editor/tasks")
    public List<TaskResponse> getEditorTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            @RequestParam(required = false) Long projectId,
            Authentication authentication
    ) {
        return taskService
                .getEditorTasks(
                        status,
                        prioritate,
                        categorie,
                        projectId,
                        authentication.getName()
                )
                .stream()
                .map(TaskMapper::toResponse)
                .toList();
    }

    // =========================
    // CREATE TASK
    // =========================
    @PostMapping("/editor/tasks")
    public TaskResponse createTask(
            @Valid @RequestBody TaskRequest dto,
            Authentication authentication
    ) {
        User editor = userService.findByUsername(authentication.getName());

        ProjectResponse project = projectService.getProjectById(
                dto.getProjectId(),
                editor.getId(),
                editor.getRol()
        );

        if (project == null) {
            throw new ForbiddenException("You are not allowed to add tasks to this project");
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

        return TaskMapper.toResponse(taskService.save(task));
    }

    // =========================
// EDITOR – GET TASK BY ID
// =========================
    @GetMapping("/editor/tasks/{id}")
    public ResponseEntity<TaskResponse> getEditorTaskById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Task task = taskService.findById(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        User editor = userService.findByUsername(authentication.getName());

        ProjectResponse project = projectService.getProjectById(
                task.getProjectId(),
                editor.getId(),
                editor.getRol()
        );

        if (project == null) {
            throw new ForbiddenException("You are not allowed to access this task");
        }

        return ResponseEntity.ok(TaskMapper.toResponse(task));
    }

    // =========================
// EDITOR – UPDATE TASK
// =========================
    @PutMapping("/editor/tasks/{id}")
    public TaskResponse updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest dto,
            Authentication authentication
    ) {
        Task existing = taskService.findById(id);
        if (existing == null) {
            throw new RuntimeException("Task not found");
        }

        User editor = userService.findByUsername(authentication.getName());

        // verificăm acces la proiect
        ProjectResponse project = projectService.getProjectById(
                existing.getProjectId(),
                editor.getId(),
                editor.getRol()
        );

        if (project == null) {
            throw new ForbiddenException("You are not allowed to edit this task");
        }

        // update câmpuri
        existing.setTitlu(dto.getTitlu());
        existing.setDescriere(dto.getDescriere());
        existing.setStatus(dto.getStatus());
        existing.setPrioritate(dto.getPrioritate());
        existing.setCategorie(dto.getCategorie());
        existing.setDataLimita(dto.getDataLimita());

        return TaskMapper.toResponse(taskService.update(existing));
    }

    // =========================
// EDITOR – ASSIGN TASK
// =========================
    @PostMapping("/editor/tasks/{id}/assign")
    public TaskResponse assignTask(
            @PathVariable Long id,
            @RequestParam Long userId,
            Authentication authentication
    ) {
        Task task = taskService.findById(id);
        if (task == null) {
            throw new RuntimeException("Task not found");
        }

        User editor = userService.findByUsername(authentication.getName());

        // verificăm accesul editorului la proiect
        ProjectResponse project = projectService.getProjectById(
                task.getProjectId(),
                editor.getId(),
                editor.getRol()
        );

        if (project == null) {
            throw new ForbiddenException("You are not allowed to assign this task");
        }

        // verificăm că user-ul există
        User user = userService.findById(userId);
        if (user == null || !"ROLE_USER".equals(user.getRol())) {
            throw new RuntimeException("Invalid user");
        }

        task.setIdCreator(userId);
        return TaskMapper.toResponse(taskService.update(task));
    }
    // =========================
// EDITOR – DELETE TASK
// =========================
    @DeleteMapping("/editor/tasks/{id}")
    public void deleteTask(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Task task = taskService.findById(id);
        if (task == null) {
            throw new RuntimeException("Task not found");
        }

        User editor = userService.findByUsername(authentication.getName());

        // verificăm accesul editorului la proiect
        ProjectResponse project = projectService.getProjectById(
                task.getProjectId(),
                editor.getId(),
                editor.getRol()
        );

        if (project == null) {
            throw new ForbiddenException("You are not allowed to delete this task");
        }

        taskService.delete(id);
    }


}
