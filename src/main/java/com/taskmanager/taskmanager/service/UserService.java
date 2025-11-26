package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.User;

import java.util.List;

public interface UserService {

    User findByUsername(String username);

    Long getUserIdByUsername(String username);

    List<User> findAllUsers();   // folosit în EditorController pentru dropdown

    User saveUser(User user);

    void deleteUser(Long id);
}
