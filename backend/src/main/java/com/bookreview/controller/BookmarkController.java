package com.bookreview.controller;

import com.bookreview.dto.BookmarkedBookDto;
import com.bookreview.security.UserPrincipal;
import com.bookreview.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {
    private static final Logger logger = LoggerFactory.getLogger(BookmarkController.class);

    @Autowired
    private BookmarkService bookmarkService;

    @GetMapping
    public ResponseEntity<List<BookmarkedBookDto>> getUserBookmarks(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            List<BookmarkedBookDto> bookmarks = bookmarkService.getUserBookmarks(userPrincipal.getId());
            return ResponseEntity.ok(bookmarks);
        } catch (Exception e) {
            logger.error("Error retrieving bookmarks for user: {}", userPrincipal.getEmail(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/{bookId}")
    public ResponseEntity<Void> toggleBookmark(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long bookId) {
        if (userPrincipal == null) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            bookmarkService.toggleBookmark(userPrincipal.getId(), bookId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error toggling bookmark for user: {} and book: {}", userPrincipal.getEmail(), bookId, e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{bookId}/status")
    public ResponseEntity<Boolean> isBookmarked(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long bookId) {
        if (userPrincipal == null) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            boolean isBookmarked = bookmarkService.isBookmarked(userPrincipal.getId(), bookId);
            return ResponseEntity.ok(isBookmarked);
        } catch (Exception e) {
            logger.error("Error checking bookmark status for user: {} and book: {}", userPrincipal.getEmail(), bookId, e);
            return ResponseEntity.status(500).build();
        }
    }
} 