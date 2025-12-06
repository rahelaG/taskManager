package com.taskmanager.taskmanager.tests;

import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.repository.UserRepository;
import com.taskmanager.taskmanager.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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
    void findByUsername_shouldReturnUser() {
        User u = new User();
        when(userRepository.findByUtilizator("ana")).thenReturn(u);

        User result = userService.findByUsername("ana");

        assertEquals(u, result);
    }

    @Test
    void getUserIdByUsername_shouldReturnId() {
        User u = new User();
        u.setId(5L);

        when(userRepository.findByUtilizator("alex")).thenReturn(u);

        Long id = userService.getUserIdByUsername("alex");

        assertEquals(5L, id);
    }

    @Test
    void getUserIdByUsername_shouldReturnNullIfNotFound() {
        when(userRepository.findByUtilizator("ghost")).thenReturn(null);

        Long id = userService.getUserIdByUsername("ghost");

        assertNull(id);
    }

    @Test
    void saveUser_shouldEncodePassword() {
        User u = new User();
        u.setParola("pass123");

        when(encoder.encode("pass123")).thenReturn("ENCODED");
        when(userRepository.save(u)).thenReturn(u);

        userService.saveUser(u);

        assertEquals("ENCODED", u.getParola());
        verify(userRepository).save(u);
    }

    @Test
    void updateUser_shouldPreserveOldPassword() {
        User existing = new User();
        existing.setId(10L);
        existing.setParola("OLD_HASH");

        User updated = new User();
        updated.setId(10L);
        updated.setParola("NEW_SHOULD_BE_IGNORED");

        when(userRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(userRepository.save(updated)).thenReturn(updated);

        User result = userService.updateUser(updated);

        assertEquals("OLD_HASH", result.getParola());
        verify(userRepository).save(updated);
    }

    @Test
    void changePassword_shouldEncodeAndSave() {
        User u = new User();
        u.setId(3L);

        when(userRepository.findById(3L)).thenReturn(Optional.of(u));
        when(encoder.encode("abc")).thenReturn("HASHED");

        userService.changePassword(3L, "abc");

        assertEquals("HASHED", u.getParola());
        verify(userRepository).save(u);
    }
}
