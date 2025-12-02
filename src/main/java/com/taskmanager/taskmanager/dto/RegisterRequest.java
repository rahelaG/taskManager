package com.taskmanager.taskmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String nume;
    private String username;
    private String password;
}
