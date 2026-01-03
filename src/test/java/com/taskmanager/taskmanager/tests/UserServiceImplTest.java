package com.taskmanager.taskmanager.tests;

import com.taskmanager.taskmanager.dto.AdminCreateUserRequest;
import com.taskmanager.taskmanager.dto.RegisterRequest;
import com.taskmanager.taskmanager.dto.UserUpdateRequest;
import com.taskmanager.taskmanager.entity.Role;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.BadRequestException;
import com.taskmanager.taskmanager.exception.NotFoundException;
import com.taskmanager.taskmanager.repository.UserRepository;
import com.taskmanager.taskmanager.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    private UserRepository userRepository;
    private BCryptPasswordEncoder encoder;
    private UserServiceImpl userService;

    @BeforeEach
    void setup() {
        userRepository = mock(UserRepository.class);
        encoder = mock(BCryptPasswordEncoder.class);
        userService = new UserServiceImpl(userRepository, encoder);
    }

    @Test
    void getById_shouldReturnUser() {
        User u = new User();
        u.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(u));

        User result = userService.getById(1L);

        assertEquals(1L, result.getId());
    }

    @Test
    void getById_shouldThrowIfNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> userService.getById(99L));
    }

    @Test
    void createUser_shouldEncodePasswordAndSave() {
        AdminCreateUserRequest req = new AdminCreateUserRequest();
        req.setNume("Ana");
        req.setUtilizator("ana");
        req.setParola("pass123");
        req.setRol(String.valueOf(Role.ROLE_USER));

        when(encoder.encode("pass123")).thenReturn("ENCODED");

        when(userRepository.save(any(User.class))).thenReturn(new User());

        userService.createUser(req);

        verify(encoder).encode("pass123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_shouldUpdateFieldsExceptPassword() {
        User existing = new User();
        existing.setId(5L);
        existing.setParola("OLD_HASH");

        when(userRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(userRepository.save(existing)).thenReturn(existing);

        UserUpdateRequest req = new UserUpdateRequest();
        req.setNume("New Name");
        req.setUtilizator("newuser");
        req.setRol(String.valueOf(Role.ROLE_EDITOR));

        User result = userService.updateUser(5L, req);

        assertEquals(Role.ROLE_EDITOR, result.getRol());
        assertEquals("OLD_HASH", result.getParola());
    }

    @Test
    void changePassword_shouldEncodeAndSave() {
        User u = new User();
        u.setId(3L);

        when(userRepository.findById(3L)).thenReturn(Optional.of(u));
        when(encoder.encode("newpass")).thenReturn("HASHED");

        userService.changePassword(3L, "newpass");

        assertEquals("HASHED", u.getParola());
    }

    @Test
    void findEditors_shouldReturnOnlyEditors() {
        when(userRepository.findByRol(Role.ROLE_EDITOR))
                .thenReturn(List.of(new User(), new User()));

        List<User> editors = userService.findEditors();

        assertEquals(2, editors.size());
    }

    @Test
    void registerUser_shouldCreateUserWithRoleUser() {
        RegisterRequest req = new RegisterRequest();
        req.setNume("Ion");
        req.setUsername("ion");
        req.setPassword("pass123");

        when(encoder.encode("pass123")).thenReturn("HASHED");

        userService.registerUser(req);

        verify(userRepository).save(argThat(user ->
                user.getUtilizator().equals("ion") &&
                        user.getRol() == Role.ROLE_USER &&
                        user.getParola().equals("HASHED")
        ));
    }
}
