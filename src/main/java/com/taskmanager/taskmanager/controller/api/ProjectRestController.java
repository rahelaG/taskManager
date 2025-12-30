package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.dto.ProjectRequest;
import com.taskmanager.taskmanager.dto.ProjectResponse;
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

    // ADMIN – creeaza proiect si asigneaza editor
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication
    ) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        if (!"ROLE_ADMIN".equals(role)) {
            throw new ForbiddenException("Only admins can create projects");
        }

        ProjectResponse saved = projectService.createProject(request);
        return ResponseEntity.ok(saved);
    }

    // ADMIN – vede toate proiectele
    // EDITOR – vede doar proiectele lui
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(Authentication authentication) {

        String username = authentication.getName();
        User user = userService.findByUsername(username);
        String role = user.getRol();

        if ("ROLE_ADMIN".equals(role)) {
            return ResponseEntity.ok(projectService.findAllProjects());
        }

        if ("ROLE_EDITOR".equals(role)) {
            return ResponseEntity.ok(projectService.findProjectsForEditor(user.getId()));
        }

        return ResponseEntity.status(403).build();
    }

    // ADMIN / EDITOR – detalii proiect
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        String role = user.getRol();

        ProjectResponse project = projectService.getProjectById(id, user.getId(), role);

        if (project == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok(project);
    }
}
