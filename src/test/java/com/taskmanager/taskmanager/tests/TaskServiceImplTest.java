package com.taskmanager.taskmanager.tests;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.repository.TaskRepository;
import com.taskmanager.taskmanager.service.UserService;
import com.taskmanager.taskmanager.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceImplTest {

    private TaskRepository taskRepository;
    private UserService userService;
    private TaskServiceImpl taskService;

    @BeforeEach
    void setUp() {
        taskRepository = mock(TaskRepository.class);
        userService = mock(UserService.class);
        taskService = new TaskServiceImpl(taskRepository, userService);
    }

    @Test
    void testFilterTasks_RemovesEmptyStrings() {
        // Arrange
        when(userService.getUserIdByUsername("maria")).thenReturn(1L);
        when(taskRepository.filterTasks(null, null, null, 1L)).thenReturn(List.of());

        // Act
        List<Task> result = taskService.filterTasks("", " ", "", "maria");

        // Assert
        verify(taskRepository).filterTasks(null, null, null, 1L);
        assertNotNull(result);
    }

    @Test
    void testFilterTasks_CallsRepositoryWithUserId() {
        when(userService.getUserIdByUsername("ana")).thenReturn(5L);
        when(taskRepository.filterTasks("done", null, null, 5L)).thenReturn(List.of());

        taskService.filterTasks("done", null, null, "ana");

        verify(taskRepository).filterTasks("done", null, null, 5L);
    }

    @Test
    void testFilterTasksForEditor_CleansEmptyParams() {
        when(taskRepository.filterTasksForEditor(null, "HIGH", null)).thenReturn(List.of());

        taskService.filterTasksForEditor("", "HIGH", "  ");

        verify(taskRepository).filterTasksForEditor(null, "HIGH", null);
    }

    @Test
    void testSaveTask() {
        Task task = new Task();
        when(taskRepository.save(task)).thenReturn(task);

        Task result = taskService.save(task);

        assertEquals(task, result);
        verify(taskRepository).save(task);
    }

    @Test
    void testDeleteTask() {
        taskService.delete(10L);
        verify(taskRepository).deleteById(10L);
    }
}
