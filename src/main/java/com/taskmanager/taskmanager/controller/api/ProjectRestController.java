package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.entity.Project;
import com.taskmanager.taskmanager.entity.User;
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

    /**
     * ADMIN – creeaza proiect si asigneaza editor
     */
    @PostMapping
    public ResponseEntity<Project> createProject(
            @Valid @RequestBody Project project,
            Authentication authentication
    ) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        if (!"ROLE_ADMIN".equals(role)) {
            return ResponseEntity.status(403).build();
        }

        Project saved = projectService.createProject(project);
        return ResponseEntity.ok(saved);
    }

    /**
     * ADMIN – vede toate proiectele
     * EDITOR – vede doar proiectele lui
     */
    @GetMapping
    public ResponseEntity<List<Project>> getProjects(Authentication authentication) {

        String username = authentication.getName();
        User user = userService.findByUsername(username);
        String role = user.getRol();

        // ADMIN: toate proiectele
        if ("ROLE_ADMIN".equals(role)) {
            return ResponseEntity.ok(projectService.findAllProjects());
        }

        // EDITOR: doar proiectele lui
        if ("ROLE_EDITOR".equals(role)) {
            return ResponseEntity.ok(
                    projectService.findProjectsForEditor(user.getId())
            );
        }

        // USER: momentan nu vede direct proiecte (va veni prin task-uri)
        return ResponseEntity.status(403).build();
    }

    /**
     * ADMIN / EDITOR – detalii proiect
     */
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        String role = user.getRol();

        Project project = projectService.getProjectById(id, user.getId(), role);

        if (project == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok(project);
    }
}
