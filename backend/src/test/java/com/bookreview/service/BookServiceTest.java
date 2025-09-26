package com.bookreview.service;

import com.bookreview.model.Book;
import com.bookreview.repository.BookRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class BookServiceTest {
    @Autowired
    private BookRepository bookRepository;

    @Test
    public void testCreateAndRetrieveBook() {
        Book book = new Book();
        book.setTitle("JUnit Test Book");
        book.setAuthor("Test Author");
        book.setGenre("Test Genre");
        book.setDescription("A book created by a test.");
        book.setPublishedYear(2024);
        book.setPageCount(123);
        book.setRating(4.5);
        bookRepository.save(book);

        Book found = bookRepository.findAll().stream()
            .filter(b -> "JUnit Test Book".equals(b.getTitle()))
            .findFirst().orElse(null);
        Assertions.assertNotNull(found);
        Assertions.assertEquals("Test Author", found.getAuthor());
    }
} 