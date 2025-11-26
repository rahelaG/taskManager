package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.repository.UserRepository;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUtilizator(username);
    }

    @Override
    public Long getUserIdByUsername(String username) {
        User user = userRepository.findByUtilizator(username);
        return (user != null) ? user.getId() : null;
    }
}
