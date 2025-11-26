package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.repository.TaskRepository;
import com.taskmanager.taskmanager.service.TaskService;
import com.taskmanager.taskmanager.service.UserService;
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

    // ✔ USER: vede DOAR task-urile lui
    @Override
    public List<Task> filterTasks(String status, String prioritate, String categorie, String username) {

        if (status != null && status.isBlank()) status = null;
        if (prioritate != null && prioritate.isBlank()) prioritate = null;
        if (categorie != null && categorie.isBlank()) categorie = null;

        Long userId = userService.getUserIdByUsername(username);

        return taskRepository.filterTasks(status, prioritate, categorie, userId);
    }

    // ✔ EDITOR: vede TOATE task-urile
    @Override
    public List<Task> filterTasksForEditor(String status, String prioritate, String categorie) {

        if (status != null && status.isBlank()) status = null;
        if (prioritate != null && prioritate.isBlank()) prioritate = null;
        if (categorie != null && categorie.isBlank()) categorie = null;

        return taskRepository.filterTasksForEditor(status, prioritate, categorie);
    }

    @Override
    public Task save(Task task) {
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
}
