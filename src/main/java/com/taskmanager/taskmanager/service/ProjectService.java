package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.dto.ProjectRequest;
import com.taskmanager.taskmanager.dto.ProjectResponse;

import java.util.List;

public interface ProjectService {

    // ADMIN: creeaza proiect si asigneaza editor
    ProjectResponse createProject(ProjectRequest request);

    // ADMIN: vede toate proiectele
    List<ProjectResponse> findAllProjects();

    // EDITOR: vede doar proiectele lui
    List<ProjectResponse> findProjectsForEditor(Long editorId);

    // EDITOR / ADMIN: vede un proiect daca are acces
    ProjectResponse getProjectById(Long projectId, Long editorId, String role);

    List<Long> findProjectIdsForEditor(Long editorId);

    // 🔹 R4: ADMIN – update status proiect
    ProjectResponse updateProjectStatus(Long projectId, String status);

    // 🔹 R4: ADMIN – update proiect (nume, descriere, editor)
    ProjectResponse updateProject(Long projectId, ProjectRequest request);

}
