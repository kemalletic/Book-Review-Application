package com.bookreview;

import com.bookreview.model.Book;
import com.bookreview.model.Review;
import com.bookreview.model.User;
import com.bookreview.repository.BookRepository;
import com.bookreview.repository.ReviewRepository;
import com.bookreview.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest
@Transactional
public class ReviewServiceTest {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void testCreateAndFetchReview() {
        // Create user
        User user = new User();
        user.setName("Review Tester");
        user.setEmail("reviewer@example.com");
        user.setPassword("password");
        userRepository.save(user);

        // Create book
        Book book = new Book();
        book.setTitle("Review Test Book");
        book.setAuthor("Review Author");
        bookRepository.save(book);

        // Create review
        Review review = new Review();
        review.setBook(book);
        review.setUserId(user.getId());
        review.setUserName(user.getName());
        review.setRating(5);
        review.setContent("Great book!");
        review.setDate(java.time.LocalDateTime.now());
        reviewRepository.save(review);

        // Fetch reviews for the book
        List<Review> reviews = reviewRepository.findAll();
        boolean found = reviews.stream().anyMatch(r -> r.getBook().getId().equals(book.getId()) && r.getUserId().equals(user.getId()));
        Assertions.assertTrue(found);
    }
} 