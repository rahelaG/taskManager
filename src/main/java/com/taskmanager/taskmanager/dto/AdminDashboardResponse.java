package com.taskmanager.taskmanager.dto;

import java.util.List;

public class AdminDashboardResponse {

    private long totalUsers;

    private int usersRoleUser;
    private int usersRoleEditor;
    private int usersRoleAdmin;

    private List<LatestUser> latestUsers;

    // Getters & Setters

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public int getUsersRoleUser() {
        return usersRoleUser;
    }

    public void setUsersRoleUser(int usersRoleUser) {
        this.usersRoleUser = usersRoleUser;
    }

    public int getUsersRoleEditor() {
        return usersRoleEditor;
    }

    public void setUsersRoleEditor(int usersRoleEditor) {
        this.usersRoleEditor = usersRoleEditor;
    }

    public int getUsersRoleAdmin() {
        return usersRoleAdmin;
    }

    public void setUsersRoleAdmin(int usersRoleAdmin) {
        this.usersRoleAdmin = usersRoleAdmin;
    }

    public List<LatestUser> getLatestUsers() {
        return latestUsers;
    }

    public void setLatestUsers(List<LatestUser> latestUsers) {
        this.latestUsers = latestUsers;
    }

    // inner class
    public static class LatestUser {
        private Long id;
        private String nume;
        private String utilizator;
        private String rol;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNume() { return nume; }
        public void setNume(String nume) { this.nume = nume; }

        public String getUtilizator() { return utilizator; }
        public void setUtilizator(String utilizator) { this.utilizator = utilizator; }

        public String getRol() { return rol; }
        public void setRol(String rol) { this.rol = rol; }
    }
}
