package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;

    public TaskServiceImpl(TaskRepository taskRepository, UserService userService) {
        this.taskRepository = taskRepository;
        this.userService = userService;
    }

    @Override
    public List<Task> filterTasks(String status, String prioritate, String categorie, String username) {

        if (status != null && status.isBlank()) status = null;
        if (prioritate != null && prioritate.isBlank()) prioritate = null;
        if (categorie != null && categorie.isBlank()) categorie = null;

        Long userId = userService.getUserIdByUsername(username);

        return taskRepository.filterTasks(status, prioritate, categorie, userId);
    }
}
