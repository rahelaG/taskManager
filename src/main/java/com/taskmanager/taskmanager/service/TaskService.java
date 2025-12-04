package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.Task;

import java.util.List;

public interface TaskService {

    // Pentru USER normal (filtrează DOAR task-urile lui)
    List<Task> filterTasks(String status, String prioritate, String categorie, String username);

    // Pentru EDITOR: filtrează TOATE task-urile
    List<Task> filterTasksForEditor(String status, String prioritate, String categorie);

    // CRUD necesar pentru Editor (și eventual Admin)
    Task save(Task task);
    Task update(Task task);
    void delete(Long id);
    Task findById(Long id);

    List<Task> findAll();
    int countByStatus(String status);

    int countByPriority(String prioritate);
}
