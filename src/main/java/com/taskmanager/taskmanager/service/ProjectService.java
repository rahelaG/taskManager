package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.dto.ProjectRequest;
import com.taskmanager.taskmanager.dto.ProjectResponse;

import java.util.List;

public interface ProjectService {

    // =========================
    // LEGACY / INTERNAL
    // =========================
    List<ProjectResponse> findAllProjects();
    List<ProjectResponse> findProjectsForEditor(Long editorId);

    ProjectResponse getProjectById(Long projectId, Long editorId, String role);

    List<Long> findProjectIdsForEditor(Long editorId);

    ProjectResponse updateProjectStatus(Long projectId, String status);
    ProjectResponse updateProject(Long projectId, ProjectRequest request);
    void deleteProject(Long projectId);

    // =========================
    // PUBLIC API (CONTROLLER)
    // =========================
    ProjectResponse createProject(ProjectRequest request, String username);
    List<ProjectResponse> getProjectsForUser(String username);
    ProjectResponse getProjectForUser(Long projectId, String username);
}
