package com.taskmanager.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(min = 3, max = 100, message = "Project name must be between 3 and 100 characters")
    private String nume;

    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String descriere;

    // optional: daca nu vine, il setam in backend pe ACTIVE
    private String status;

    // ADMIN seteaza editorul responsabil
    @NotNull(message = "Editor ID is required")
    private Long editorId;
}
