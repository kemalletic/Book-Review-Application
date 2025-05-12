package com.bookreview.service;

import com.bookreview.dto.ReviewDto;
import com.bookreview.model.Book;
import com.bookreview.model.Review;
import com.bookreview.repository.BookRepository;
import com.bookreview.repository.ReviewRepository;
import com.bookreview.security.UserPrincipal;
import com.bookreview.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {
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

    public ReviewDto addReview(Long bookId, ReviewDto reviewDto, UserPrincipal userPrincipal) {
        Book book = bookRepository.findById(bookId).orElseThrow();
        Review review = new Review();
        review.setBook(book);
        review.setUserId(userPrincipal.getId());
        review.setUserName(userPrincipal.getName());
        review.setUserAvatar(userPrincipal.getAvatarUrl());
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        review.setDate(LocalDateTime.now());
        review.setLikes(0);
        review.setImages(reviewDto.getImages());
        review.setVideos(reviewDto.getVideos());
        Review saved = reviewRepository.save(review);
        return toDto(saved);
    }

    private ReviewDto toDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setBookId(review.getBook().getId());
        dto.setUserId(review.getUserId());
        dto.setUserName(review.getUserName());
        dto.setUserAvatar(review.getUserAvatar());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setDate(review.getDate());
        dto.setLikes(review.getLikes());
        dto.setImages(review.getImages());
        dto.setVideos(review.getVideos());
        return dto;
    }
} 