package com.bookreview.service;

import com.bookreview.dto.ReviewDto;
import com.bookreview.model.Book;
import com.bookreview.model.Review;
import com.bookreview.repository.BookRepository;
import com.bookreview.repository.ReviewRepository;
import com.bookreview.security.UserPrincipal;
import com.bookreview.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);
    
    @Value("${app.api-url}")
    private String apiUrl;
    
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;

    public List<ReviewDto> getReviewsByBookId(Long bookId) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isEmpty()) return List.of();
        return reviewRepository.findByBook(bookOpt.get()).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ReviewDto> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public ReviewDto addReview(Long bookId, ReviewDto reviewDto, UserPrincipal userPrincipal) {
        logger.info("Adding review for book {} by user {}: {}", bookId, userPrincipal.getId(), reviewDto);
        
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
            
        Review review = new Review();
        review.setBook(book);
        review.setUserId(userPrincipal.getId());
        review.setUserName(userPrincipal.getName());
        review.setUserAvatar(userPrincipal.getAvatarUrl());
        review.setRating(reviewDto.getRating());
        review.setContent(reviewDto.getContent());
        review.setDate(LocalDateTime.now());
        review.setLikes(0);
        review.setImages(reviewDto.getImages());
        review.setVideos(reviewDto.getVideos());
        
        try {
            Review saved = reviewRepository.save(review);
            logger.info("Successfully saved review with id: {}", saved.getId());
            return toDto(saved);
        } catch (Exception e) {
            logger.error("Error saving review: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save review: " + e.getMessage());
        }
    }

    private ReviewDto toDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setBookId(review.getBook().getId());
        dto.setBookTitle(review.getBook().getTitle());
        String coverUrl = review.getBook().getCover();
        if (coverUrl != null && !coverUrl.startsWith("http")) {
            coverUrl = apiUrl + coverUrl;
        }
        dto.setBookCover(coverUrl);
        dto.setUserId(review.getUserId());
        dto.setUserName(review.getUserName());
        dto.setUserAvatar(review.getUserAvatar());
        dto.setRating(review.getRating());
        dto.setContent(review.getContent());
        dto.setDate(review.getDate());
        dto.setLikes(review.getLikes());
        dto.setImages(review.getImages());
        dto.setVideos(review.getVideos());
        return dto;
    }
} 