package com.taskmanager.taskmanager.dto;

public class AuthResponse {

    private Long id;
    private String username;  // din câmpul utilizator
    private String nume;      // numele complet
    private String rol;       // ROLE_USER / ROLE_EDITOR / ROLE_ADMIN

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNume() {
        return nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
