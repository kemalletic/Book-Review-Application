package com.bookreview.service;

import com.bookreview.dto.BookmarkedBookDto;
import com.bookreview.model.Book;
import com.bookreview.model.Bookmark;
import com.bookreview.model.User;
import com.bookreview.repository.BookmarkRepository;
import com.bookreview.repository.BookRepository;
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
public class BookmarkService {
    private static final Logger logger = LoggerFactory.getLogger(BookmarkService.class);

    @Value("${app.api-url}")
    private String apiUrl;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BookmarkedBookDto> getUserBookmarks(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return bookmarkRepository.findByUser(user).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public void toggleBookmark(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));

        Optional<Bookmark> existingBookmark = bookmarkRepository.findByUserAndBook(user, book);
        
        if (existingBookmark.isPresent()) {
            bookmarkRepository.delete(existingBookmark.get());
        } else {
            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setBook(book);
            bookmark.setDateAdded(LocalDateTime.now());
            bookmarkRepository.save(bookmark);
        }
    }

    public boolean isBookmarked(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));

        return bookmarkRepository.findByUserAndBook(user, book).isPresent();
    }

    private BookmarkedBookDto toDto(Bookmark bookmark) {
        BookmarkedBookDto dto = new BookmarkedBookDto();
        Book book = bookmark.getBook();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        String coverUrl = book.getCover();
        if (coverUrl != null && !coverUrl.startsWith("http")) {
            coverUrl = apiUrl + coverUrl;
        }
        dto.setCover(coverUrl);
        dto.setRating(book.getRating());
        dto.setGenre(book.getGenre());
        dto.setDateAdded(bookmark.getDateAdded());
        return dto;
    }
} 