package com.bookreview.controller;

import com.bookreview.dto.ReviewDto;
import com.bookreview.service.ReviewService;
import com.bookreview.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/books/{bookId}/reviews")
public class ReviewController {
    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);
    
    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public List<ReviewDto> getReviews(@PathVariable Long bookId) {
        return reviewService.getReviewsByBookId(bookId);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ReviewDto addReview(
            @PathVariable Long bookId,
            @Valid @RequestBody ReviewDto reviewDto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        logger.info("Adding review for book {}: {}", bookId, reviewDto);
        try {
            return reviewService.addReview(bookId, reviewDto, userPrincipal);
        } catch (Exception e) {
            logger.error("Error adding review for book {}: {}", bookId, e.getMessage(), e);
            throw e;
        }
    }
} 