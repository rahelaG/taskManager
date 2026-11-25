package com.taskmanager.taskmanager.tests;

import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.exception.BadRequestException;
import com.taskmanager.taskmanager.repository.UserRepository;
import com.taskmanager.taskmanager.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class UserPasswordTest {

    private UserRepository userRepository;
    private BCryptPasswordEncoder encoder;
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        encoder = spy(new BCryptPasswordEncoder());
        userService = new UserServiceImpl(userRepository, encoder);
    }

    @Test
    void changePassword_validPassword_savesMatchingBcryptHash() {
        String newPassword = "newpass123";
        User user = new User();
        user.setId(3L);

        when(userRepository.findById(3L)).thenReturn(Optional.of(user));

        userService.changePassword(3L, newPassword);

        verify(encoder).encode(newPassword);

        ArgumentCaptor<User> savedUser = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUser.capture());

        String savedHash = savedUser.getValue().getParola();
        assertNotEquals(newPassword, savedHash);
        assertTrue(new BCryptPasswordEncoder().matches(newPassword, savedHash));
    }

    @Test
    void changePassword_shortPassword_stopsBeforeEncodingOrSaving() {
        assertThrows(BadRequestException.class,
                () -> userService.changePassword(3L, "abcde"));

        verifyNoInteractions(encoder, userRepository);
    }
}