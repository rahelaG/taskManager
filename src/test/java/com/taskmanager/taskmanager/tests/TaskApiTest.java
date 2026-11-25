package com.taskmanager.taskmanager.tests;

import com.taskmanager.taskmanager.controller.api.TaskRestController;
import com.taskmanager.taskmanager.dto.TaskResponse;
import com.taskmanager.taskmanager.security.CustomUserDetailsService;
import com.taskmanager.taskmanager.security.SecurityConfig;
import com.taskmanager.taskmanager.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskRestController.class)
@Import(SecurityConfig.class)
class TaskApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser(username = "maria", roles = "USER")
    void assignTask_withUserRole_returnsForbidden() throws Exception {
        mockMvc.perform(post("/api/editor/tasks/{id}/assign", 42L)
                        .param("userId", "7")
                        .with(csrf()))
                .andExpect(status().isForbidden());

        verifyNoInteractions(taskService);
    }

    @Test
    @WithMockUser(username = "editor", roles = "EDITOR")
    void assignTask_withEditorRole_returnsTaskJson() throws Exception {
        TaskResponse assignedTask = new TaskResponse();
        assignedTask.setTitlu("Implementare cos");
        assignedTask.setProjectName("Magazin online");

        when(taskService.assignTask(42L, 7L, "editor"))
                .thenReturn(assignedTask);

        mockMvc.perform(post("/api/editor/tasks/{id}/assign", 42L)
                        .param("userId", "7")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titlu").value("Implementare cos"))
                .andExpect(jsonPath("$.projectName").value("Magazin online"));

        verify(taskService).assignTask(42L, 7L, "editor");
    }

    @Test
    @WithMockUser(username = "editor", roles = "EDITOR")
    void createTask_withShortTitle_returnsBadRequest() throws Exception {
        String requestBody = """
                {
                    "titlu": "ab",
                    "descriere": "Implementare cos de cumparaturi",
                    "status": "TODO",
                    "prioritate": "HIGH",
                    "categorie": "Backend",
                    "projectId": 10
                }
                """;

        mockMvc.perform(post("/api/editor/tasks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(taskService);
    }

    @Test
    @WithMockUser(username = "editor", roles = "EDITOR")
    void assignTask_withoutUserId_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/editor/tasks/{id}/assign", 42L)
                        .with(csrf()))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(taskService);
    }

    @Test
    @WithMockUser(username = "editor", roles = "EDITOR")
    void deleteTask_withEditorRole_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/editor/tasks/{id}", 42L)
                        .with(csrf()))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

        verify(taskService).deleteTask(42L, "editor");
    }
}