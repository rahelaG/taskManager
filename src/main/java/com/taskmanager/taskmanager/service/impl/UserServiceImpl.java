package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.dto.*;
import com.taskmanager.taskmanager.entity.Role;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.BadRequestException;
import com.taskmanager.taskmanager.exception.NotFoundException;
import com.taskmanager.taskmanager.repository.UserRepository;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // CRUD ADMIN
    // =========================

    @Override
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User createUser(AdminCreateUserRequest req) {
        User user = new User();
        user.setNume(req.getNume());
        user.setUtilizator(req.getUtilizator());
        user.setParola(passwordEncoder.encode(req.getParola()));
        user.setRol(Role.valueOf(req.getRol()));

        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, UserUpdateRequest req) {
        User existing = getById(id);

        existing.setNume(req.getNume());
        existing.setUtilizator(req.getUtilizator());
        existing.setRol(Role.valueOf(req.getRol()));

        return userRepository.save(existing);
    }

    @Override
    public void deleteUser(Long id) {
        getById(id); // validare existență
        userRepository.deleteById(id);
    }

    // =========================
    // SECURITY / AUTH
    // =========================

    @Override
    public User findByUtilizator(String utilizator) {
        User user = userRepository.findByUtilizator(utilizator);
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    @Override
    public void registerUser(RegisterRequest req) {
        if (req.getPassword() == null || req.getPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }

        User user = new User();
        user.setNume(req.getNume());
        user.setUtilizator(req.getUsername());
        user.setParola(passwordEncoder.encode(req.getPassword()));
        user.setRol(Role.ROLE_USER);

        userRepository.save(user);
    }

    @Override
    public void changePassword(Long id, String newPassword) {
        if (newPassword == null || newPassword.isBlank()) {
            throw new BadRequestException("Password cannot be empty");
        }
        if (newPassword.length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }

        User user = getById(id);
        user.setParola(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // =========================
    // ADMIN VIEW
    // =========================

    @Override
    public List<User> findEditors() {
        return userRepository.findByRol(Role.ROLE_EDITOR);
    }

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        List<User> users = userRepository.findAll();

        AdminDashboardResponse res = new AdminDashboardResponse();
        res.setTotalUsers(users.size());
        res.setUsersRoleUser((int) users.stream().filter(u -> u.getRol() == Role.ROLE_USER).count());
        res.setUsersRoleEditor((int) users.stream().filter(u -> u.getRol() == Role.ROLE_EDITOR).count());
        res.setUsersRoleAdmin((int) users.stream().filter(u -> u.getRol() == Role.ROLE_ADMIN).count());

        res.setLatestUsers(
                users.stream()
                        .sorted((a, b) -> b.getId().compareTo(a.getId()))
                        .limit(5)
                        .map(u -> {
                            AdminDashboardResponse.LatestUser dto =
                                    new AdminDashboardResponse.LatestUser();
                            dto.setId(u.getId());
                            dto.setNume(u.getNume());
                            dto.setUtilizator(u.getUtilizator());
                            dto.setRol(u.getRol().name());
                            return dto;
                        })
                        .toList()
        );

        return res;
    }
}
