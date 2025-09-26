package com.bookreview;

import com.bookreview.dto.AuthResponse;
import com.bookreview.dto.LoginRequest;
import com.bookreview.dto.RegisterRequest;
import com.bookreview.model.User;
import com.bookreview.repository.UserRepository;
import com.bookreview.service.AuthService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class AuthServiceTest {
    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void testRegisterAndLogin() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("testuser@example.com");
        registerRequest.setPassword("testpass123");

        AuthResponse registerResponse = authService.register(registerRequest);
        Assertions.assertNotNull(registerResponse.getToken());
        Assertions.assertEquals("Test User", registerResponse.getName());
        Assertions.assertEquals("testuser@example.com", registerResponse.getEmail());

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("testuser@example.com");
        loginRequest.setPassword("testpass123");
        AuthResponse loginResponse = authService.login(loginRequest);
        Assertions.assertNotNull(loginResponse.getToken());
        Assertions.assertEquals("Test User", loginResponse.getName());
    }
} 