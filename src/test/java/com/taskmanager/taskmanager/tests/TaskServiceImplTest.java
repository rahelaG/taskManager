package com.taskmanager.taskmanager.tests;

import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.dto.TaskResponse;
import com.taskmanager.taskmanager.entity.Project;
import com.taskmanager.taskmanager.entity.Role;
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

    @Test
    void getUserTaskResponses_returnsTasksForUser() {
        User user = new User();
        user.setId(1L);

        Project project = new Project();
        project.setId(10L);

        Task task = new Task();
        task.setProject(project);

        when(userService.findByUtilizator("maria")).thenReturn(user);
        when(taskRepository.filterTasksForUser(null, null, null, 1L))
                .thenReturn(List.of(task));

        ProjectResponse projectResponse = new ProjectResponse();
        projectResponse.setNume("Project A");

        when(projectService.getProjectById(10L, null, Role.ROLE_ADMIN.name()))
                .thenReturn(projectResponse);

        List<TaskResponse> result =
                taskService.getUserTaskResponses(null, null, null, "maria");

        assertEquals(1, result.size());
        assertEquals("Project A", result.get(0).getProjectName());
    }

    @Test
    void getEditorTaskResponses_withoutProjectId_returnsEditorTasks() {
        User editor = new User();
        editor.setId(5L);
        editor.setRol(Role.ROLE_EDITOR);

        Project p1 = new Project(); p1.setId(100L);
        Project p2 = new Project(); p2.setId(200L);

        Task t1 = new Task(); t1.setProject(p1);
        Task t2 = new Task(); t2.setProject(p2);

        when(userService.findByUtilizator("editor")).thenReturn(editor);
        when(projectService.findProjectIdsForEditor(5L))
                .thenReturn(List.of(100L, 200L));

        when(taskRepository.filterTasksForEditorProjects(
                List.of(100L, 200L), null, null, null
        )).thenReturn(List.of(t1, t2));

        when(projectService.getProjectById(anyLong(), any(), any()))
                .thenReturn(new ProjectResponse());

        List<TaskResponse> result =
                taskService.getEditorTaskResponses(null, null, null, null, "editor");

        assertEquals(2, result.size());
    }

    @Test
    void deleteTask_deletesById() {
        taskService.delete(42L);
        verify(taskRepository).deleteById(42L);
    }
}
