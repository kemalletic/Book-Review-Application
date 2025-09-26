package com.bookreview.repository;

import com.bookreview.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByTitle(String title);
    Page<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author, Pageable pageable);
    Page<Book> findByGenreIgnoreCase(String genre, Pageable pageable);
    Page<Book> findByGenreIgnoreCaseAndTitleContainingIgnoreCaseOrGenreIgnoreCaseAndAuthorContainingIgnoreCase(
        String genre1, String title, String genre2, String author, Pageable pageable);
    Page<Book> findByRatingBetweenAndPublishedYearBetween(double minRating, double maxRating, int minYear, int maxYear, Pageable pageable);
    Page<Book> findByGenreIgnoreCaseAndRatingBetweenAndPublishedYearBetween(String genre, double minRating, double maxRating, int minYear, int maxYear, Pageable pageable);
    Page<Book> findByGenreIgnoreCaseAndTitleContainingIgnoreCaseAndRatingBetweenAndPublishedYearBetweenOrGenreIgnoreCaseAndAuthorContainingIgnoreCaseAndRatingBetweenAndPublishedYearBetween(
        String genre1, String title, double minRating1, double maxRating1, int minYear1, int maxYear1,
        String genre2, String author, double minRating2, double maxRating2, int minYear2, int maxYear2,
        Pageable pageable);
} 