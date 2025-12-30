package com.taskmanager.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectStatusRequest {

    @NotBlank(message = "status is required")
    private String status;
}
