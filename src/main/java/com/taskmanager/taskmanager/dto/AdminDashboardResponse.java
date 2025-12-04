package com.taskmanager.taskmanager.dto;

import java.util.List;

public class AdminDashboardResponse {

    // -------------------------
    // USERS BY ROLE
    // -------------------------
    private int usersRoleUser;
    private int usersRoleEditor;
    private int usersRoleAdmin;

    // -------------------------
    // TASKS BY PRIORITY
    // -------------------------
    private int priorityHigh;
    private int priorityMedium;
    private int priorityLow;

    // -------------------------
    // GLOBAL STATS
    // -------------------------
    private long totalUsers;
    private long totalTasks;
    private long tasksTodo;
    private long tasksInProgress;
    private long tasksDone;

    // -------------------------
    // TOP USERS
    // -------------------------
    private List<TopUser> topUsers;

    // -------------------------
    // RECENT TASKS
    // -------------------------
    private List<RecentTask> recentTasks;


    // ================ GETTERS & SETTERS ================

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

    public int getPriorityHigh() {
        return priorityHigh;
    }

    public void setPriorityHigh(int priorityHigh) {
        this.priorityHigh = priorityHigh;
    }

    public int getPriorityMedium() {
        return priorityMedium;
    }

    public void setPriorityMedium(int priorityMedium) {
        this.priorityMedium = priorityMedium;
    }

    public int getPriorityLow() {
        return priorityLow;
    }

    public void setPriorityLow(int priorityLow) {
        this.priorityLow = priorityLow;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getTasksTodo() {
        return tasksTodo;
    }

    public void setTasksTodo(long tasksTodo) {
        this.tasksTodo = tasksTodo;
    }

    public long getTasksInProgress() {
        return tasksInProgress;
    }

    public void setTasksInProgress(long tasksInProgress) {
        this.tasksInProgress = tasksInProgress;
    }

    public long getTasksDone() {
        return tasksDone;
    }

    public void setTasksDone(long tasksDone) {
        this.tasksDone = tasksDone;
    }

    public List<TopUser> getTopUsers() {
        return topUsers;
    }

    public void setTopUsers(List<TopUser> topUsers) {
        this.topUsers = topUsers;
    }

    public List<RecentTask> getRecentTasks() {
        return recentTasks;
    }

    public void setRecentTasks(List<RecentTask> recentTasks) {
        this.recentTasks = recentTasks;
    }


    // ===================================================
    // INNER CLASS 1 — TOP USERS
    // ===================================================
    public static class TopUser {
        private String nume;
        private String rol;
        private Long total;

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

        public Long getTotal() {
            return total;
        }

        public void setTotal(Long total) {
            this.total = total;
        }
    }


    // ===================================================
    //  INNER CLASS 2 — RECENT TASKS
    // ===================================================
    public static class RecentTask {
        private String titlu;
        private String status;
        private String dataCreare;

        public String getTitlu() {
            return titlu;
        }

        public void setTitlu(String titlu) {
            this.titlu = titlu;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getDataCreare() {
            return dataCreare;
        }

        public void setDataCreare(String dataCreare) {
            this.dataCreare = dataCreare;
        }
    }
}
