package com.taskmanager.taskmanager.mapper;

import com.taskmanager.taskmanager.dto.UserResponse;
import com.taskmanager.taskmanager.entity.User;

public class UserMapper {

    public static UserResponse toResponse(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setNume(user.getNume());
        dto.setUtilizator(user.getUtilizator());
        dto.setRol(user.getRol());
        return dto;
    }
}
