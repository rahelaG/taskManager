package com.taskmanager.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminCreateUserRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 50, message = "Full name must be between 2 and 50 characters")
    private String nume;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String utilizator;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String parola;

    @NotBlank(message = "Role is required")
    @Pattern(
            regexp = "ROLE_USER|ROLE_EDITOR|ROLE_ADMIN",
            message = "Role must be one of: ROLE_USER, ROLE_EDITOR, ROLE_ADMIN"
    )
    private String rol;
}

