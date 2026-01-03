package com.taskmanager.taskmanager.mapper;

import com.taskmanager.taskmanager.dto.ProjectResponse;
import com.taskmanager.taskmanager.entity.Project;

public class ProjectMapper {

    public static ProjectResponse toResponse(Project p) {
        ProjectResponse dto = new ProjectResponse();

        dto.setId(p.getId());
        dto.setNume(p.getNume());
        dto.setDescriere(p.getDescriere());
        dto.setStatus(p.getStatus().name()); // ENUM -> String
        dto.setDataCreare(p.getDataCreare());

        // RELAȚIE -> ID
        dto.setEditorId(
                p.getEditor() != null ? p.getEditor().getId() : null
        );

        return dto;
    }
}
