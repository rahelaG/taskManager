package com.taskmanager.taskmanager.tests;

import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.dto.TaskResponse;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.repository.TaskRepository;
import com.taskmanager.taskmanager.service.ProjectService;
import com.taskmanager.taskmanager.service.UserService;
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
    // USER TASKS (TaskResponse)
    // =========================
    @Test
    void getUserTaskResponses_returnsTasksForUser() {
        User user = new User();
        user.setId(1L);

        Task task = new Task();
        task.setProjectId(10L);

        when(userService.findByUtilizator("maria")).thenReturn(user);
        when(taskRepository.filterTasksForUser(null, null, null, 1L))
                .thenReturn(List.of(task));

        ProjectResponse project = new ProjectResponse();
        project.setNume("Project A");

        when(projectService.getProjectById(10L, null, "ROLE_ADMIN"))
                .thenReturn(project);

        List<TaskResponse> result =
                taskService.getUserTaskResponses(null, null, null, "maria");

        assertEquals(1, result.size());
        assertEquals("Project A", result.get(0).getProjectName());
    }

    // =========================
    // EDITOR TASKS – ALL PROJECTS
    // =========================
    @Test
    void getEditorTaskResponses_withoutProjectId_returnsEditorTasks() {
        User editor = new User();
        editor.setId(5L);
        editor.setRol("ROLE_EDITOR");

        Task t1 = new Task();
        t1.setProjectId(100L);
        Task t2 = new Task();
        t2.setProjectId(200L);

        when(userService.findByUtilizator("editor")).thenReturn(editor);
        when(projectService.findProjectIdsForEditor(5L))
                .thenReturn(List.of(100L, 200L));

        when(taskRepository.filterTasksForEditorProjects(
                List.of(100L, 200L),
                null,
                null,
                null
        )).thenReturn(List.of(t1, t2));

        when(projectService.getProjectById(anyLong(), any(), any()))
                .thenReturn(new ProjectResponse());

        List<TaskResponse> result =
                taskService.getEditorTaskResponses(null, null, null, null, "editor");

        assertEquals(2, result.size());
    }

    // =========================
    // EDITOR TASKS – ONE PROJECT
    // =========================
    @Test
    void getEditorTaskResponses_withProjectId_returnsOnlyThatProjectTasks() {
        User editor = new User();
        editor.setId(3L);
        editor.setRol("ROLE_EDITOR");

        Task task = new Task();
        task.setProjectId(99L);

        when(userService.findByUtilizator("editor")).thenReturn(editor);
        when(projectService.findProjectIdsForEditor(3L))
                .thenReturn(List.of(99L));

        when(taskRepository.findByProjectId(99L))
                .thenReturn(List.of(task));

        when(projectService.getProjectById(99L, null, "ROLE_ADMIN"))
                .thenReturn(new ProjectResponse());

        List<TaskResponse> result =
                taskService.getEditorTaskResponses(null, null, null, 99L, "editor");

        assertEquals(1, result.size());
        verify(taskRepository).findByProjectId(99L);
    }

    // =========================
    // SAVE TASK
    // =========================
    @Test
    void saveTask_withProjectId_succeeds() {
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
