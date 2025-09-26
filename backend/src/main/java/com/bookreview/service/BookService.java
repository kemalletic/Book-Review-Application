package com.bookreview.service;

import com.bookreview.dto.BookDto;
import com.bookreview.model.Book;
import com.bookreview.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public Page<BookDto> getAllBooks(String search, String genre, int page, int size, String sortBy, String sortDir,
                                     Double minRating, Double maxRating, Integer minYear, Integer maxYear) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Book> booksPage;
        double minR = minRating != null ? minRating : 0.0;
        double maxR = maxRating != null ? maxRating : 5.0;
        int minY = minYear != null ? minYear : 0;
        int maxY = maxYear != null ? maxYear : 3000;
        if (genre != null && !genre.isEmpty() && search != null && !search.isEmpty()) {
            booksPage = bookRepository.findByGenreIgnoreCaseAndTitleContainingIgnoreCaseAndRatingBetweenAndPublishedYearBetweenOrGenreIgnoreCaseAndAuthorContainingIgnoreCaseAndRatingBetweenAndPublishedYearBetween(
                genre, search, minR, maxR, minY, maxY,
                genre, search, minR, maxR, minY, maxY,
                pageable);
        } else if (genre != null && !genre.isEmpty()) {
            booksPage = bookRepository.findByGenreIgnoreCaseAndRatingBetweenAndPublishedYearBetween(genre, minR, maxR, minY, maxY, pageable);
        } else if (search != null && !search.isEmpty()) {
            booksPage = bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(search, search, pageable);
        } else if (minRating != null || maxRating != null || minYear != null || maxYear != null) {
            booksPage = bookRepository.findByRatingBetweenAndPublishedYearBetween(minR, maxR, minY, maxY, pageable);
        } else {
            booksPage = bookRepository.findAll(pageable);
        }
        return booksPage.map(this::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<BookDto> getBookById(Long id) {
        return bookRepository.findById(id).map(this::toDto);
    }

    @Transactional
    public BookDto createBook(BookDto bookDto) {
        Book book = toEntity(bookDto);
        Book saved = bookRepository.save(book);
        return toDto(saved);
    }

    @Transactional
    public Optional<BookDto> updateBook(Long id, BookDto bookDto) {
        return bookRepository.findById(id).map(existing -> {
            existing.setTitle(bookDto.getTitle());
            existing.setAuthor(bookDto.getAuthor());
            existing.setCover(bookDto.getCover());
            existing.setRating(bookDto.getRating());
            existing.setGenre(bookDto.getGenre());
            existing.setDescription(bookDto.getDescription());
            existing.setPublishedYear(bookDto.getPublishedYear());
            existing.setPageCount(bookDto.getPageCount());
            Book updated = bookRepository.save(existing);
            return toDto(updated);
        });
    }

    @Transactional
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    private BookDto toDto(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setCover(book.getCover());
        dto.setRating(book.getRating());
        dto.setGenre(book.getGenre());
        dto.setDescription(book.getDescription());
        dto.setPublishedYear(book.getPublishedYear());
        dto.setPageCount(book.getPageCount());
        return dto;
    }

    private Book toEntity(BookDto dto) {
        Book book = new Book();
        book.setId(dto.getId());
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setCover(dto.getCover());
        book.setRating(dto.getRating());
        book.setGenre(dto.getGenre());
        book.setDescription(dto.getDescription());
        book.setPublishedYear(dto.getPublishedYear());
        book.setPageCount(dto.getPageCount());
        return book;
    }
} 