package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.dto.ProjectRequest;
import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.entity.Project;
import com.taskmanager.taskmanager.entity.ProjectStatus;
import com.taskmanager.taskmanager.mapper.ProjectMapper;
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

    @Override
    public ProjectResponse createProject(ProjectRequest request) {

        Project project = new Project();
        project.setId(null);
        project.setNume(request.getNume());
        project.setDescriere(request.getDescriere());
        project.setEditorId(request.getEditorId());
        project.setDataCreare(LocalDate.now());

        // 🔹 R4: status default + validare
        project.setStatus(normalizeStatus(request.getStatus()));

        Project saved = projectRepository.save(project);
        return ProjectMapper.toResponse(saved);
    }

    @Override
    public List<ProjectResponse> findAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    @Override
    public List<ProjectResponse> findProjectsForEditor(Long editorId) {
        return projectRepository.findByEditorId(editorId)
                .stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    @Override
    public List<Long> findProjectIdsForEditor(Long editorId) {
        return projectRepository.findProjectIdsByEditorId(editorId);
    }

    @Override
    public ProjectResponse getProjectById(Long projectId, Long editorId, String role) {

        Project project = null;

        if ("ROLE_ADMIN".equals(role)) {
            project = projectRepository.findById(projectId).orElse(null);
        } else if ("ROLE_EDITOR".equals(role)) {
            project = projectRepository.findByIdAndEditorId(projectId, editorId).orElse(null);
        }

        return project == null ? null : ProjectMapper.toResponse(project);
    }

    // 🔹 R4 helper – status valid
    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return ProjectStatus.ACTIVE.name();
        }
        return ProjectStatus.valueOf(status.trim().toUpperCase()).name();
    }

    @Override
    public ProjectResponse updateProjectStatus(Long projectId, String status) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        project.setStatus(
                ProjectStatus.valueOf(status.trim().toUpperCase()).name()
        );

        Project saved = projectRepository.save(project);
        return ProjectMapper.toResponse(saved);
    }
    @Override
    public ProjectResponse updateProject(Long projectId, ProjectRequest request) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        project.setNume(request.getNume());
        project.setDescriere(request.getDescriere());
        project.setEditorId(request.getEditorId());

        Project saved = projectRepository.save(project);
        return ProjectMapper.toResponse(saved);
    }

    @Override
    public void deleteProject(Long projectId) {

        if (!projectRepository.existsById(projectId)) {
            throw new IllegalArgumentException("Project not found");
        }

        projectRepository.deleteById(projectId);
    }



}
