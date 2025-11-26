package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.User;

public interface UserService {
    User findByUsername(String username);
    Long getUserIdByUsername(String username);
}
