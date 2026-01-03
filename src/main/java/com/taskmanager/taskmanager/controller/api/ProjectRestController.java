package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.ProjectRequest;
import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.dto.ProjectStatusRequest;
import com.taskmanager.taskmanager.entity.Role;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.ForbiddenException;
import com.taskmanager.taskmanager.service.ProjectService;
import com.taskmanager.taskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectRestController {

    private final ProjectService projectService;
    private final UserService userService;

    public ProjectRestController(ProjectService projectService,
                                 UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    // =========================
    // ADMIN – CREATE PROJECT
    // =========================
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication
    ) {
        User user = userService.findByUtilizator(authentication.getName());

        if (user.getRol() != Role.ROLE_ADMIN) {
            throw new ForbiddenException("Only admins can create projects");
        }

        return ResponseEntity.ok(
                projectService.createProject(request, user.getUtilizator())
        );
    }

    // =========================
    // ADMIN / EDITOR – PROJECTS
    // =========================
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(Authentication authentication) {
        return ResponseEntity.ok(
                projectService.getProjectsForUser(authentication.getName())
        );
    }

    // =========================
    // ADMIN / EDITOR – PROJECT DETAILS
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                projectService.getProjectForUser(id, authentication.getName())
        );
    }

    // =========================
    // ADMIN – UPDATE PROJECT
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication
    ) {
        User user = userService.findByUtilizator(authentication.getName());

        if (user.getRol() != Role.ROLE_ADMIN) {
            throw new ForbiddenException("Only admins can update projects");
        }

        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    // =========================
    // ADMIN – UPDATE STATUS
    // =========================
    @PutMapping("/{id}/status")
    public ResponseEntity<ProjectResponse> updateProjectStatus(
            @PathVariable Long id,
            @RequestBody ProjectStatusRequest request,
            Authentication authentication
    ) {
        User user = userService.findByUtilizator(authentication.getName());

        if (user.getRol() != Role.ROLE_ADMIN) {
            throw new ForbiddenException("Only admins can update project status");
        }

        return ResponseEntity.ok(
                projectService.updateProjectStatus(id, request.getStatus())
        );
    }

    // =========================
    // ADMIN – DELETE PROJECT
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = userService.findByUtilizator(authentication.getName());

        if (user.getRol() != Role.ROLE_ADMIN) {
            throw new ForbiddenException("Only admins can delete projects");
        }

        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
