package com.bookreview.repository;

import com.bookreview.model.Bookmark;
import com.bookreview.model.Book;
import com.bookreview.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUser(User user);
    Optional<Bookmark> findByUserAndBook(User user, Book book);
    void deleteByUserAndBook(User user, Book book);
} 