package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.repository.TaskRepository;
import com.taskmanager.taskmanager.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    @Override
    public List<Task> filterTasks(String status, String prioritate, String categorie) {
        return taskRepository.findAll((root, query, cb) -> {

            var predicates = cb.conjunction();

            if (status != null && !status.isEmpty()) {
                predicates.getExpressions().add(cb.equal(root.get("status"), status));
            }

            if (prioritate != null && !prioritate.isEmpty()) {
                predicates.getExpressions().add(cb.equal(root.get("prioritate"), prioritate));
            }

            if (categorie != null && !categorie.isEmpty()) {
                predicates.getExpressions().add(cb.equal(root.get("categorie"), categorie));
            }

            return predicates;
        });
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
}
