package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.User;
import java.util.List;

public interface UserService {
    User findByUsername(String username);
    List<User> findAllUsers();
    User saveUser(User user);
    void deleteUser(Long id);
}
