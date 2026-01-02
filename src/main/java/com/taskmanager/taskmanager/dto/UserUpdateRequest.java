package com.taskmanager.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {

    @NotBlank
    @Size(min = 2, max = 50)
    private String nume;

    @NotBlank
    @Size(min = 3, max = 30)
    private String utilizator; // ✅ LIPSEA

    @NotBlank
    @Pattern(
            regexp = "ROLE_USER|ROLE_EDITOR|ROLE_ADMIN",
            message = "Invalid role"
    )
    private String rol;
}
