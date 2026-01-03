package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.dto.*;
import com.taskmanager.taskmanager.entity.User;

import java.util.List;

public interface UserService {

    // =========================
    // CRUD ADMIN
    // =========================
    User getById(Long id);
    List<User> findAllUsers();
    User createUser(AdminCreateUserRequest req);
    User updateUser(Long id, UserUpdateRequest req);
    void deleteUser(Long id);

    // =========================
    // SECURITY / AUTH
    // =========================
    User findByUtilizator(String utilizator);
    void registerUser(RegisterRequest req);
    void changePassword(Long id, String newPassword);

    // =========================
    // ADMIN VIEW
    // =========================
    List<User> findEditors();
    AdminDashboardResponse getAdminDashboard();
}
