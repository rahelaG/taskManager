package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.Task;

import java.util.List;

public interface TaskService {
    List<Task> findAll();
    List<Task> filterTasks(String status, String prioritate, String categorie);
    Task save(Task task);
    Task update(Task task);
    void delete(Long id);
    Task findById(Long id);
}
