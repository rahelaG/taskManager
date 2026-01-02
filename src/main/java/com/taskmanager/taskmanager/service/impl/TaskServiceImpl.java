package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.dto.TaskRequest;
import com.taskmanager.taskmanager.dto.TaskResponse;
import com.taskmanager.taskmanager.entity.ProjectStatus;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.ForbiddenException;
import com.taskmanager.taskmanager.exception.NotFoundException;
import com.taskmanager.taskmanager.mapper.TaskMapper;
import com.taskmanager.taskmanager.repository.TaskRepository;
import com.taskmanager.taskmanager.service.ProjectService;
import com.taskmanager.taskmanager.service.TaskService;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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


    // USER

    @Override
    public List<Task> getUserTasks(String status, String prioritate, String categorie, String username) {
        User user = userService.findByUtilizator(username);

        return taskRepository.filterTasksForUser(
                normalize(status),
                normalize(prioritate),
                normalize(categorie),
                user.getId()
        );
    }

    @Override
    public List<TaskResponse> getUserTaskResponses(String status, String prioritate, String categorie, String username) {
        return getUserTasks(status, prioritate, categorie, username)
                .stream()
                .map(this::mapWithProjectName)
                .toList();
    }

    // EDITOR
    @Override
    public List<Task> getEditorTasks(String status, String prioritate, String categorie, Long projectId, String username) {
        User editor = userService.findByUtilizator(username);

        if ("ROLE_ADMIN".equals(editor.getRol())) {
            throw new ForbiddenException("Admins are not allowed to access tasks");
        }

        List<Long> projectIds = projectService.findProjectIdsForEditor(editor.getId());

        if (projectId != null) {
            if (!projectIds.contains(projectId)) {
                throw new ForbiddenException("No access to this project");
            }
            return taskRepository.findByProjectId(projectId);
        }

        return taskRepository.filterTasksForEditorProjects(
                projectIds,
                normalize(status),
                normalize(prioritate),
                normalize(categorie)
        );
    }

    @Override
    public List<TaskResponse> getEditorTaskResponses(String status, String prioritate, String categorie, Long projectId, String username) {
        return getEditorTasks(status, prioritate, categorie, projectId, username)
                .stream()
                .map(this::mapWithProjectName)
                .toList();
    }

    // NOILE METODE
    @Override
    public TaskResponse createTask(TaskRequest dto, String username) {
        User editor = userService.findByUtilizator(username);

        ProjectResponse project =
                projectService.getProjectById(dto.getProjectId(), editor.getId(), editor.getRol());

        if (ProjectStatus.ARCHIVED.name().equals(project.getStatus())) {
            throw new ForbiddenException("Project is archived");
        }

        Task task = new Task();
        task.setTitlu(dto.getTitlu());
        task.setDescriere(dto.getDescriere());
        task.setStatus(dto.getStatus());
        task.setPrioritate(dto.getPrioritate());
        task.setCategorie(dto.getCategorie());
        task.setProjectId(dto.getProjectId());
        task.setIdCreator(editor.getId());
        task.setDataCreare(LocalDate.now());

        return mapWithProjectName(taskRepository.save(task));
    }

    @Override
    public TaskResponse getTaskByIdForEditor(Long id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        validateEditorAccess(task, username);
        return mapWithProjectName(task);
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest dto, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        validateEditorAccess(task, username);

        task.setTitlu(dto.getTitlu());
        task.setDescriere(dto.getDescriere());
        task.setStatus(dto.getStatus());
        task.setPrioritate(dto.getPrioritate());
        task.setCategorie(dto.getCategorie());
        task.setDataLimita(dto.getDataLimita());

        return mapWithProjectName(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        validateEditorAccess(task, username);
        taskRepository.deleteById(id);
    }

    @Override
    public TaskResponse assignTask(Long id, Long userId, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        validateEditorAccess(task, username);

        task.setIdCreator(userId);
        return mapWithProjectName(taskRepository.save(task));
    }

    // HELPERS
    private void validateEditorAccess(Task task, String username) {
        User editor = userService.findByUtilizator(username);

        ProjectResponse project =
                projectService.getProjectById(task.getProjectId(), editor.getId(), editor.getRol());

        if (project == null) {
            throw new ForbiddenException("No access to this task");
        }

        if (ProjectStatus.ARCHIVED.name().equals(project.getStatus())) {
            throw new ForbiddenException("Project is archived");
        }
    }

    private TaskResponse mapWithProjectName(Task task) {
        TaskResponse dto = TaskMapper.toResponse(task);
        ProjectResponse project = projectService.getProjectById(task.getProjectId(), null, "ROLE_ADMIN");
        if (project != null) dto.setProjectName(project.getNume());
        return dto;
    }

    private String normalize(String v) {
        return (v == null || v.isBlank()) ? null : v;
    }

// LEGACY / SHARED METHODS
    @Override
    public Task save(Task task) {
        if (task.getProjectId() == null) {
            throw new IllegalArgumentException("Task must belong to a project");
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


// DASHBOARD / STATS
    @Override
    public int countByStatus(String status) {
        return taskRepository.countByStatus(status);
    }

    @Override
    public int countByPriority(String prioritate) {
        return taskRepository.countByPrioritate(prioritate);
    }

}
