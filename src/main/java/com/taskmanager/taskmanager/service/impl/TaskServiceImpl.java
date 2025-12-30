package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.entity.ProjectStatus;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.ForbiddenException;
import com.taskmanager.taskmanager.repository.TaskRepository;
import com.taskmanager.taskmanager.service.ProjectService;
import com.taskmanager.taskmanager.service.TaskService;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;
    private final ProjectService projectService;

    public TaskServiceImpl(
            TaskRepository taskRepository,
            UserService userService,
            ProjectService projectService
    ) {
        this.taskRepository = taskRepository;
        this.userService = userService;
        this.projectService = projectService;
    }

    // =========================
    // USER
    // =========================
    @Override
    public List<Task> getUserTasks(
            String status,
            String prioritate,
            String categorie,
            String username
    ) {
        Long userId = userService.getUserIdByUsername(username);

        status = normalize(status);
        prioritate = normalize(prioritate);
        categorie = normalize(categorie);

        return taskRepository.filterTasksForUser(
                status,
                prioritate,
                categorie,
                userId
        );
    }

    // =========================
    // EDITOR ONLY (ADMIN INTERZIS)
    // =========================
    @Override
    public List<Task> getEditorTasks(
            String status,
            String prioritate,
            String categorie,
            Long projectId,
            String username
    ) {
        User user = userService.findByUsername(username);

        if ("ROLE_ADMIN".equals(user.getRol())) {
            throw new ForbiddenException("Admins are not allowed to access tasks");
        }

        status = normalize(status);
        prioritate = normalize(prioritate);
        categorie = normalize(categorie);

        List<Long> editorProjectIds =
                projectService.findProjectIdsForEditor(user.getId());

        if (editorProjectIds.isEmpty()) {
            return List.of();
        }

        if (projectId != null) {
            if (!editorProjectIds.contains(projectId)) {
                throw new ForbiddenException("Editor has no access to this project");
            }
            return taskRepository.findByProjectId(projectId);
        }

        return taskRepository.filterTasksForEditorProjects(
                editorProjectIds,
                status,
                prioritate,
                categorie
        );
    }

    // =========================
    // CRUD
    // =========================
    @Override
    public Task save(Task task) {
        if (task.getProjectId() == null) {
            throw new RuntimeException("Task must belong to a project");
        }
        return taskRepository.save(task);
    }

    @Override
    public Task update(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public Task findById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    @Override
    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    // =========================
    // DASHBOARD
    // =========================
    @Override
    public int countByStatus(String status) {
        return taskRepository.countByStatus(status);
    }

    @Override
    public int countByPriority(String prioritate) {
        return taskRepository.countByPrioritate(prioritate);
    }

    // =========================
    // HELPER
    // =========================
    private String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
