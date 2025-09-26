package com.bookreview.controller;

import com.bookreview.dto.BookDto;
import com.bookreview.service.BookService;
import com.bookreview.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookController.class)
public class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookService bookService;

    @MockBean
    private BookRepository bookRepository;

    @Test
    @WithMockUser
    public void testGetAllBooks() throws Exception {
        // Create test data
        BookDto book1 = new BookDto();
        book1.setId(1L);
        book1.setTitle("Test Book 1");
        book1.setAuthor("Author 1");

        BookDto book2 = new BookDto();
        book2.setId(2L);
        book2.setTitle("Test Book 2");
        book2.setAuthor("Author 2");

        Page<BookDto> booksPage = new PageImpl<>(Arrays.asList(book1, book2));

        // Mock the service response with explicit parameter matching
        when(bookService.getAllBooks(
            eq(null),    // search
            eq(null),    // genre
            eq(0),       // page
            eq(10),      // size
            eq("title"), // sortBy
            eq("ASC"),   // sortDir
            eq(null),    // minRating
            eq(null),    // maxRating
            eq(null),    // minYear
            eq(null)     // maxYear
        )).thenReturn(booksPage);

        // Perform the test
        mockMvc.perform(get("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test Book 1"))
                .andExpect(jsonPath("$.content[1].title").value("Test Book 2"));
    }

    @Test
    @WithMockUser
    public void testGetBookById() throws Exception {
        // Create test data
        BookDto book = new BookDto();
        book.setId(1L);
        book.setTitle("Test Book");
        book.setAuthor("Test Author");

        // Mock the service response
        when(bookService.getBookById(1L)).thenReturn(Optional.of(book));

        // Perform the test
        mockMvc.perform(get("/api/books/1")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Book"))
                .andExpect(jsonPath("$.author").value("Test Author"));
    }
} 