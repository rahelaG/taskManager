package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.dto.TaskRequest;
import com.taskmanager.taskmanager.dto.TaskResponse;
import com.taskmanager.taskmanager.entity.Task;

import java.util.List;

public interface TaskService {

    // LEGACY (FOLOSITE INTERN)
    List<Task> getUserTasks(String status, String prioritate, String categorie, String username);
    List<Task> getEditorTasks(String status, String prioritate, String categorie, Long projectId, String username);

    Task save(Task task);
    Task update(Task task);
    void delete(Long id);
    Task findById(Long id);
    List<Task> findAll();

    int countByStatus(String status);
    int countByPriority(String prioritate);


    // PUBLIC API (CONTROLLER)

    List<TaskResponse> getUserTaskResponses(String status, String prioritate, String categorie, String username);
    List<TaskResponse> getEditorTaskResponses(String status, String prioritate, String categorie, Long projectId, String username);

    TaskResponse createTask(TaskRequest dto, String username);
    TaskResponse getTaskByIdForEditor(Long id, String username);
    TaskResponse updateTask(Long id, TaskRequest dto, String username);
    void deleteTask(Long id, String username);
    TaskResponse assignTask(Long id, Long userId, String username);
}
