package com.bookreview.controller;

import com.bookreview.dto.AuthResponse;
import com.bookreview.dto.LoginRequest;
import com.bookreview.dto.RegisterRequest;
import com.bookreview.dto.ReviewDto;
import com.bookreview.model.User;
import com.bookreview.security.UserPrincipal;
import com.bookreview.service.AuthService;
import com.bookreview.service.ReviewService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    private final ReviewService reviewService;

    public AuthController(AuthService authService, ReviewService reviewService) {
        this.authService = authService;
        this.reviewService = reviewService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        logger.debug("Profile request received for user: {}", userPrincipal != null ? userPrincipal.getEmail() : "null");
        
        if (userPrincipal == null) {
            logger.error("User principal is null - authentication failed");
            return ResponseEntity.status(403).build();
        }
        
        try {
            User user = authService.getUserProfile(userPrincipal.getId());
            logger.debug("Profile retrieved successfully for user: {}", user.getEmail());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error retrieving profile for user: {}", userPrincipal.getEmail(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/profile/reviews")
    public ResponseEntity<List<ReviewDto>> getUserReviews(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            List<ReviewDto> reviews = reviewService.getReviewsByUserId(userPrincipal.getId());
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            logger.error("Error retrieving reviews for user: {}", userPrincipal.getEmail(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody User userDetails) {
        return ResponseEntity.ok(authService.updateUserProfile(userPrincipal.getId(), userDetails));
    }
} 