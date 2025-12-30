package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.Task;

import java.util.Collection;
import java.util.List;

public interface TaskService {

    // USER
    List<Task> getUserTasks(
            String status,
            String prioritate,
            String categorie,
            String username
    );

    // EDITOR
    List<Task> getEditorTasks(
            String status,
            String prioritate,
            String categorie,
            Long projectId,
            String username
    );

    // CRUD
    Task save(Task task);
    Task update(Task task);
    void delete(Long id);
    Task findById(Long id);
    List<Task> findAll();   // ✅ FIX

    // DASHBOARD
    int countByStatus(String status);
    int countByPriority(String prioritate);
}

