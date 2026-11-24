package com.taskmanager.taskmanager.tests;

import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.dto.TaskResponse;
import com.taskmanager.taskmanager.entity.Project;
import com.taskmanager.taskmanager.entity.ProjectStatus;
import com.taskmanager.taskmanager.entity.Role;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.ForbiddenException;
import com.taskmanager.taskmanager.exception.NotFoundException;
import com.taskmanager.taskmanager.repository.TaskRepository;
import com.taskmanager.taskmanager.service.ProjectService;
import com.taskmanager.taskmanager.service.UserService;
import com.taskmanager.taskmanager.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskAssignmentTest {

    private TaskRepository taskRepository;
    private UserService userService;
    private ProjectService projectService;
    private TaskServiceImpl taskService;
    private User editor;
    private Task task;

    @BeforeEach
    void setUp() {
        taskRepository = mock(TaskRepository.class);
        userService = mock(UserService.class);
        projectService = mock(ProjectService.class);
        taskService = new TaskServiceImpl(taskRepository, userService, projectService);

        editor = new User();
        editor.setId(5L);
        editor.setRol(Role.ROLE_EDITOR);

        Project project = new Project();
        project.setId(10L);

        task = new Task();
        task.setId(42L);
        task.setTitlu("Implementare coș");
        task.setProject(project);
        task.setCreator(editor);
    }

    @Test
    void assignTask_authorizedEditor_savesTaskWithNewAssignee() {
        User maria = new User();
        maria.setId(7L);
        maria.setUtilizator("maria");

        ProjectResponse project = new ProjectResponse();
        project.setNume("Magazin online");

        givenTaskAndEditor();
        when(projectService.getProjectById(10L, 5L, Role.ROLE_EDITOR.name()))
                .thenReturn(project);
        when(userService.getById(7L)).thenReturn(maria);
        when(taskRepository.save(any(Task.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(projectService.getProjectById(10L, null, Role.ROLE_ADMIN.name()))
                .thenReturn(project);

        TaskResponse response = taskService.assignTask(42L, 7L, "editor");

        ArgumentCaptor<Task> savedTaskCaptor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(savedTaskCaptor.capture());

        Task savedTask = savedTaskCaptor.getValue();
        assertEquals(42L, savedTask.getId());
        assertEquals(10L, savedTask.getProject().getId());
        assertEquals(7L, savedTask.getCreator().getId());
        assertEquals("Magazin online", response.getProjectName());
    }

    @Test
    void assignTask_projectOutsideEditorsAccess_rejectsAssignment() {
        givenTaskAndEditor();
        when(projectService.getProjectById(10L, 5L, Role.ROLE_EDITOR.name()))
                .thenReturn(null);

        assertThrows(ForbiddenException.class,
                () -> taskService.assignTask(42L, 7L, "editor"));

        assertSame(editor, task.getCreator());
        verify(userService, never()).getById(7L);
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void assignTask_archivedProject_rejectsAssignment() {
        ProjectResponse archivedProject = new ProjectResponse();
        archivedProject.setStatus(ProjectStatus.ARCHIVED.name());

        givenTaskAndEditor();
        when(projectService.getProjectById(10L, 5L, Role.ROLE_EDITOR.name()))
                .thenReturn(archivedProject);

        assertThrows(ForbiddenException.class,
                () -> taskService.assignTask(42L, 7L, "editor"));

        assertSame(editor, task.getCreator());
        verify(userService, never()).getById(7L);
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void assignTask_missingTask_stopsBeforeCheckingAccess() {
        when(taskRepository.findById(42L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> taskService.assignTask(42L, 7L, "editor"));

        verifyNoInteractions(userService, projectService);
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void assignTask_missingAssignee_preservesPreviousAssignee() {
        givenTaskAndEditor();
        when(projectService.getProjectById(10L, 5L, Role.ROLE_EDITOR.name()))
                .thenReturn(new ProjectResponse());
        when(userService.getById(7L))
                .thenThrow(new NotFoundException("User not found"));

        assertThrows(NotFoundException.class,
                () -> taskService.assignTask(42L, 7L, "editor"));

        assertSame(editor, task.getCreator());
        verify(taskRepository, never()).save(any(Task.class));
    }

    private void givenTaskAndEditor() {
        when(taskRepository.findById(42L)).thenReturn(Optional.of(task));
        when(userService.findByUtilizator("editor")).thenReturn(editor);
    }
}