package com.bookreview.service;

import com.bookreview.dto.AuthResponse;
import com.bookreview.dto.LoginRequest;
import com.bookreview.dto.RegisterRequest;
import com.bookreview.model.User;
import com.bookreview.repository.UserRepository;
import com.bookreview.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        System.out.println("Starting registration for email: " + registerRequest.getEmail());
        
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            System.out.println("Email already exists: " + registerRequest.getEmail());
            throw new RuntimeException("Email is already taken!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        System.out.println("Saving user to database: " + user.getEmail());
        User savedUser = userRepository.save(user);
        System.out.println("User saved with ID: " + savedUser.getId());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            registerRequest.getEmail(),
                            registerRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            return new AuthResponse(jwt, user.getName(), user.getEmail());
        } catch (Exception authException) {
            System.out.println("Authentication failed during registration, but user was saved: " + authException.getMessage());
            // Return a response even if authentication fails, since user was saved
            return new AuthResponse("", user.getName(), user.getEmail());
        }
    }

    public AuthResponse login(LoginRequest loginRequest) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + loginRequest.getEmail());
        
        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> {
                    System.out.println("User not found: " + loginRequest.getEmail());
                    return new RuntimeException("Invalid email or password");
                });
        
        System.out.println("User found: " + user.getName() + " (ID: " + user.getId() + ")");
        
        // Check password
        boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        System.out.println("Password matches: " + passwordMatches);
        
        if (!passwordMatches) {
            System.out.println("Password mismatch for user: " + user.getEmail());
            throw new RuntimeException("Invalid email or password");
        }
        
        System.out.println("Authentication successful for: " + user.getEmail());
        
        // Generate JWT token
        String jwt = tokenProvider.generateToken(user.getEmail());
        System.out.println("JWT token generated successfully");
        
        return new AuthResponse(jwt, user.getName(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateUserProfile(Long userId, User userDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update only the fields that are allowed to be updated
        user.setName(userDetails.getName());
        user.setBio(userDetails.getBio());
        user.setAvatarUrl(userDetails.getAvatarUrl());

        return userRepository.save(user);
    }

} 