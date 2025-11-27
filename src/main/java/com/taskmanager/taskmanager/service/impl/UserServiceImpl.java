package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.repository.UserRepository;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User saveUser(User user) {
        user.setParola(passwordEncoder.encode(user.getParola()));
        return userRepository.save(user);
    }

    @Override
    public User updateUser(User user) {

        // 1. Luăm userul din DB
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Păstrăm parola veche
        user.setParola(existing.getParola());

        // 3. Salvăm actualizările (username, nume, rol)
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public void changePassword(Long id, String newPassword) {
        User user = findById(id);
        user.setParola(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
