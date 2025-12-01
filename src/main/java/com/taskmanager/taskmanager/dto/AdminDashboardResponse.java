package com.taskmanager.taskmanager.dto;

public class AdminDashboardResponse {

    private long totalUsers;
    private long totalTasks;
    private long tasksTodo;
    private long tasksInProgress;
    private long tasksDone;

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
}
