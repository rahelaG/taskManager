package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.User;

import java.util.List;

public interface UserService {

    User findByUsername(String username);

    Long getUserIdByUsername(String username);

    List<User> findAllUsers();

    User saveUser(User user);

    User updateUser(User user);

    void deleteUser(Long id);

    User findById(Long id);

    void changePassword(Long id, String newPassword);

    List<User> findEditors();

}
