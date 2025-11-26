package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.Task;
import java.util.List;

public interface TaskService {
    List<Task> filterTasks(String status, String prioritate, String categorie, String username);
}
