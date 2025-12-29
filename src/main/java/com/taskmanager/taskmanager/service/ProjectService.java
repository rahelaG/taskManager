package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.Project;

import java.util.List;

public interface ProjectService {

    // ADMIN: creeaza proiect si asigneaza editor
    Project createProject(Project project);

    // ADMIN: vede toate proiectele
    List<Project> findAllProjects();

    // EDITOR: vede doar proiectele lui
    List<Project> findProjectsForEditor(Long editorId);

    // EDITOR / ADMIN: vede un proiect daca are acces
    Project getProjectById(Long projectId, Long editorId, String role);
}
