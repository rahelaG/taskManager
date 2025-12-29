package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.entity.Project;
import com.taskmanager.taskmanager.repository.ProjectRepository;
import com.taskmanager.taskmanager.service.ProjectService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * ADMIN creeaza proiectul
     */
    @Override
    public Project createProject(Project project) {

        // setari controlate din backend
        project.setId(null);
        project.setDataCreare(LocalDate.now());

        if (project.getStatus() == null || project.getStatus().isBlank()) {
            project.setStatus("ACTIVE");
        }

        return projectRepository.save(project);
    }

    /**
     * ADMIN vede toate proiectele
     */
    @Override
    public List<Project> findAllProjects() {
        return projectRepository.findAll();
    }

    /**
     * EDITOR vede doar proiectele asignate lui
     */
    @Override
    public List<Project> findProjectsForEditor(Long editorId) {
        return projectRepository.findByEditorId(editorId);
    }

    /**
     * EDITOR / ADMIN – acces controlat la proiect
     */
    @Override
    public Project getProjectById(Long projectId, Long editorId, String role) {

        // ADMIN are acces complet
        if ("ROLE_ADMIN".equals(role)) {
            return projectRepository.findById(projectId).orElse(null);
        }

        // EDITOR are acces doar la proiectele lui
        if ("ROLE_EDITOR".equals(role)) {
            return projectRepository
                    .findByIdAndEditorId(projectId, editorId)
                    .orElse(null);
        }

        // USER – momentan fara acces direct (va veni prin Task-uri)
        return null;
    }
}
