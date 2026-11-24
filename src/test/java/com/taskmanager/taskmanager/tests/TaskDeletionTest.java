package com.taskmanager.taskmanager.tests;

import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.entity.Project;
import com.taskmanager.taskmanager.entity.ProjectStatus;
import com.taskmanager.taskmanager.entity.Role;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.ForbiddenException;
import com.taskmanager.taskmanager.repository.TaskRepository;
import com.taskmanager.taskmanager.service.ProjectService;
import com.taskmanager.taskmanager.service.UserService;
import com.taskmanager.taskmanager.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TaskDeletionTest {

    private ProjectService projectService;
    private TaskServiceImpl taskService;
    private Task task;
    private List<Task> deletionRequests;

    @BeforeEach
    void setUp() {
        TaskRepository taskRepository = mock(TaskRepository.class);
        UserService userService = mock(UserService.class);
        projectService = mock(ProjectService.class);
        taskService = new TaskServiceImpl(taskRepository, userService, projectService);

        User editor = new User();
        editor.setId(5L);
        editor.setRol(Role.ROLE_EDITOR);

        Project project = new Project();
        project.setId(10L);

        task = new Task();
        task.setId(42L);
        task.setProject(project);

        deletionRequests = new ArrayList<>();

        when(taskRepository.findById(42L)).thenReturn(Optional.of(task));
        when(userService.findByUtilizator("editor")).thenReturn(editor);

        doAnswer(invocation -> {
            deletionRequests.add(invocation.getArgument(0));
            return null;
        }).when(taskRepository).delete(any(Task.class));
    }

    @Test
    void deleteTask_authorizedEditor_requestsDeletionOfTask() {
        when(projectService.getProjectById(10L, 5L, Role.ROLE_EDITOR.name()))
                .thenReturn(new ProjectResponse());

        taskService.deleteTask(42L, "editor");

        assertEquals(1, deletionRequests.size());
        assertSame(task, deletionRequests.get(0));
    }

    @Test
    void deleteTask_archivedProject_doesNotRequestDeletion() {
        ProjectResponse archivedProject = new ProjectResponse();
        archivedProject.setStatus(ProjectStatus.ARCHIVED.name());

        when(projectService.getProjectById(10L, 5L, Role.ROLE_EDITOR.name()))
                .thenReturn(archivedProject);

        assertThrows(ForbiddenException.class,
                () -> taskService.deleteTask(42L, "editor"));

        assertTrue(deletionRequests.isEmpty());
    }

    @Test
    void deleteTask_projectOutsideEditorsAccess_doesNotRequestDeletion() {
        when(projectService.getProjectById(10L, 5L, Role.ROLE_EDITOR.name()))
                .thenReturn(null);

        assertThrows(ForbiddenException.class,
                () -> taskService.deleteTask(42L, "editor"));

        assertTrue(deletionRequests.isEmpty());
    }
}