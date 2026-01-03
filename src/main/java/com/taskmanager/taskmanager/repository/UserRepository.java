package com.taskmanager.taskmanager.repository;

import com.taskmanager.taskmanager.entity.Role;
import com.taskmanager.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUtilizator(String utilizator);

    List<User> findByRol(Role rol);
}
