package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.dto.ProjectRequest;
import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.entity.Project;
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

        if (request.getStatus() == null || request.getStatus().isBlank()) {
            project.setStatus("ACTIVE");
        } else {
            project.setStatus(request.getStatus());
        }

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
}
