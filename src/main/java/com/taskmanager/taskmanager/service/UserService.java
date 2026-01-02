package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.dto.*;
import com.taskmanager.taskmanager.entity.User;

import java.util.List;

public interface UserService {

    User getById(Long id);

    List<User> findAllUsers();

    User createUser(AdminCreateUserRequest req);

    User updateUser(Long id, UserUpdateRequest req);

    void deleteUser(Long id);

    void changePassword(Long id, String newPassword);

    List<User> findEditors();

    AdminDashboardResponse getAdminDashboard();

    User findByUtilizator(String utilizator);
    void registerUser(RegisterRequest req);


}
