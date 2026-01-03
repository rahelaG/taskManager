package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.dto.ProjectRequest;
import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.entity.Project;
import com.taskmanager.taskmanager.entity.ProjectStatus;
import com.taskmanager.taskmanager.entity.Role;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.ForbiddenException;
import com.taskmanager.taskmanager.exception.NotFoundException;
import com.taskmanager.taskmanager.mapper.ProjectMapper;
import com.taskmanager.taskmanager.repository.ProjectRepository;
import com.taskmanager.taskmanager.service.ProjectService;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public ProjectServiceImpl(
            ProjectRepository projectRepository,
            UserService userService
    ) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    // =========================================================
    // PUBLIC API (CONTROLLER)
    // =========================================================

    @Override
    public ProjectResponse createProject(ProjectRequest request, String username) {
        User admin = userService.findByUtilizator(username);

        if (admin.getRol() != Role.ROLE_ADMIN) {
            throw new ForbiddenException("Only admins can create projects");
        }

        User editor = userService.getById(request.getEditorId());

        Project project = new Project();
        project.setNume(request.getNume());
        project.setDescriere(request.getDescriere());
        project.setEditor(editor);
        project.setDataCreare(LocalDate.now());
        project.setStatus(normalizeStatus(request.getStatus()));

        return ProjectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    public List<ProjectResponse> getProjectsForUser(String username) {
        User user = userService.findByUtilizator(username);

        if (user.getRol() == Role.ROLE_ADMIN) {
            return findAllProjects();
        }

        if (user.getRol() == Role.ROLE_EDITOR) {
            return findProjectsForEditor(user.getId());
        }

        throw new ForbiddenException("Only admins and editors can view projects");
    }

    @Override
    public ProjectResponse getProjectForUser(Long projectId, String username) {
        User user = userService.findByUtilizator(username);

        Project project;

        if (user.getRol() == Role.ROLE_ADMIN) {
            project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new NotFoundException("Project not found"));
        } else if (user.getRol() == Role.ROLE_EDITOR) {
            project = projectRepository.findByIdAndEditor_Id(projectId, user.getId())
                    .orElseThrow(() -> new ForbiddenException("No access to this project"));
        } else {
            throw new ForbiddenException("No access to projects");
        }

        return ProjectMapper.toResponse(project);
    }

    // =========================================================
    // LEGACY / INTERNAL
    // =========================================================

    @Override
    public List<ProjectResponse> findAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    @Override
    public List<ProjectResponse> findProjectsForEditor(Long editorId) {
        return projectRepository.findByEditor_Id(editorId)
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
            project = projectRepository.findByIdAndEditor_Id(projectId, editorId).orElse(null);
        }

        return project == null ? null : ProjectMapper.toResponse(project);
    }

    @Override
    public ProjectResponse updateProjectStatus(Long projectId, String status) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));

        project.setStatus(ProjectStatus.valueOf(status.toUpperCase()));
        return ProjectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    public ProjectResponse updateProject(Long projectId, ProjectRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));

        project.setNume(request.getNume());
        project.setDescriere(request.getDescriere());

        if (request.getEditorId() != null) {
            project.setEditor(userService.getById(request.getEditorId()));
        }

        return ProjectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new NotFoundException("Project not found");
        }
        projectRepository.deleteById(projectId);
    }

    // =========================================================
    // HELPER
    // =========================================================

    private ProjectStatus normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return ProjectStatus.ACTIVE;
        }
        return ProjectStatus.valueOf(status.trim().toUpperCase());
    }
}
