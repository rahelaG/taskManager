package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.repository.TaskRepository;
import com.taskmanager.taskmanager.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TaskServiceImplTest {

    private TaskRepository taskRepository;
    private UserService userService;
    private ProjectService projectService;
    private TaskServiceImpl taskService;

    @BeforeEach
    void setUp() {
        taskRepository = mock(TaskRepository.class);
        userService = mock(UserService.class);
        projectService = mock(ProjectService.class);

        taskService = new TaskServiceImpl(
                taskRepository,
                userService,
                projectService
        );
    }

    // =========================
    // USER TASKS
    // =========================
    @Test
    void getUserTasks_returnsOnlyUserTasks() {
        when(userService.getUserIdByUsername("maria")).thenReturn(1L);
        when(taskRepository.filterTasksForUser(null, null, null, 1L))
                .thenReturn(List.of(new Task()));

        List<Task> result =
                taskService.getUserTasks(null, null, null, "maria");

        assertEquals(1, result.size());
        verify(taskRepository).filterTasksForUser(null, null, null, 1L);
    }

    // =========================
    // EDITOR TASKS (ALL PROJECTS)
    // =========================
    @Test
    void getEditorTasks_withoutProjectId_returnsTasksFromEditorProjects() {
        User editor = new User();
        editor.setId(10L);
        editor.setRol("ROLE_EDITOR");

        when(userService.findByUsername("editor")).thenReturn(editor);
        when(projectService.findProjectIdsForEditor(10L))
                .thenReturn(List.of(100L, 200L));

        when(taskRepository.filterTasksForEditorProjects(
                List.of(100L, 200L),
                null,
                null,
                null
        )).thenReturn(List.of(new Task(), new Task()));

        List<Task> result =
                taskService.getEditorTasks(null, null, null, null, "editor");

        assertEquals(2, result.size());
    }

    // =========================
    // EDITOR TASKS (ONE PROJECT)
    // =========================
    @Test
    void getEditorTasks_withProjectId_returnsTasksFromThatProject() {
        User editor = new User();
        editor.setId(5L);
        editor.setRol("ROLE_EDITOR");

        when(userService.findByUsername("editor")).thenReturn(editor);
        when(projectService.findProjectIdsForEditor(5L))
                .thenReturn(List.of(99L));

        when(taskRepository.findByProjectId(99L))
                .thenReturn(List.of(new Task()));

        List<Task> result =
                taskService.getEditorTasks(null, null, null, 99L, "editor");

        assertEquals(1, result.size());
        verify(taskRepository).findByProjectId(99L);
    }

    // =========================
    // SAVE TASK
    // =========================
    @Test
    void saveTask_requiresProjectId() {
        Task task = new Task();
        task.setProjectId(1L);

        when(taskRepository.save(task)).thenReturn(task);

        Task result = taskService.save(task);

        assertEquals(task, result);
        verify(taskRepository).save(task);
    }

    // =========================
    // DELETE TASK
    // =========================
    @Test
    void deleteTask_deletesById() {
        taskService.delete(42L);
        verify(taskRepository).deleteById(42L);
    }
}
