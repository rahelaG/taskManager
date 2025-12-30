package com.taskmanager.taskmanager.mapper;

import com.taskmanager.taskmanager.dto.TaskResponse;
import com.taskmanager.taskmanager.entity.Task;

public class TaskMapper {

    public static TaskResponse toResponse(Task task) {
        TaskResponse dto = new TaskResponse();
        dto.setId(task.getId());
        dto.setTitlu(task.getTitlu());
        dto.setDescriere(task.getDescriere());
        dto.setStatus(task.getStatus());
        dto.setPrioritate(task.getPrioritate());
        dto.setCategorie(task.getCategorie());
        dto.setDataCreare(task.getDataCreare());
        dto.setDataLimita(task.getDataLimita());
        dto.setProjectId(task.getProjectId());
        dto.setIdCreator(task.getIdCreator());
        return dto;
    }
}
