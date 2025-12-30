package com.taskmanager.taskmanager.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProjectResponse {

    private Long id;
    private String nume;
    private String descriere;
    private String status;
    private LocalDate dataCreare;
    private Long editorId;
}
