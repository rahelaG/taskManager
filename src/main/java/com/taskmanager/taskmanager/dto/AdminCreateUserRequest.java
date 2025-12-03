package com.taskmanager.taskmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminCreateUserRequest {
    private String nume;
    private String utilizator;
    private String parola;
    private String rol;
}
