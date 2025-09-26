package com.bookreview.controller;

import com.bookreview.dto.BookDto;
import com.bookreview.model.Book;
import com.bookreview.repository.BookRepository;
import com.bookreview.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;
    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public ResponseEntity<Page<BookDto>> getAllBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxRating,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear
    ) {
        Page<BookDto> books = bookService.getAllBooks(search, genre, page, size, sortBy, sortDir, minRating, maxRating, minYear, maxYear);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public BookDto createBook(@Valid @RequestBody BookDto bookDto) {
        return bookService.createBook(bookDto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateBook(@PathVariable Long id, @Valid @RequestBody BookDto bookDto) {
        return bookService.updateBook(id, bookDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/cover")
    public ResponseEntity<?> uploadBookCover(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<Book> bookOpt = bookRepository.findById(id);
        if (bookOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Book book = bookOpt.get();
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }
        try {
            String uploadDir = "uploads/covers/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();
            String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + (ext != null ? "." + ext : "");
            Path filePath = Paths.get(uploadDir, filename);
            Files.write(filePath, file.getBytes());
            String coverUrl = "/" + uploadDir + filename;
            book.setCover(coverUrl);
            bookRepository.save(book);
            return ResponseEntity.ok(coverUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
        }
    }

    @PostMapping("/update-covers")
    public ResponseEntity<String> updateBookCovers() {
        try {
            // Update The Great Gatsby - Alternative reliable cover
            updateBookCover("The Great Gatsby", "https://images-na.ssl-images-amazon.com/images/P/0743273567.01.L.jpg");
            
            // Update To Kill a Mockingbird - Alternative reliable cover
            updateBookCover("To Kill a Mockingbird", "https://images-na.ssl-images-amazon.com/images/P/0061120081.01.L.jpg");
            
            // Update 1984 - Alternative reliable cover
            updateBookCover("1984", "https://images-na.ssl-images-amazon.com/images/P/0451524934.01.L.jpg");
            
            // Update Pride and Prejudice - Alternative reliable cover
            updateBookCover("Pride and Prejudice", "https://images-na.ssl-images-amazon.com/images/P/0141439513.01.L.jpg");
            
            // Update The Hobbit - Alternative reliable cover
            updateBookCover("The Hobbit", "https://images-na.ssl-images-amazon.com/images/P/054792822X.01.L.jpg");
            
            // Update The Catcher in the Rye - Alternative reliable cover
            updateBookCover("The Catcher in the Rye", "https://images-na.ssl-images-amazon.com/images/P/0316769177.01.L.jpg");
            
            return ResponseEntity.ok("Book covers updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating covers: " + e.getMessage());
        }
    }
    
    private void updateBookCover(String title, String coverUrl) {
        Optional<Book> bookOpt = bookRepository.findByTitle(title);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            book.setCover(coverUrl);
            bookRepository.save(book);
            System.out.println("Updated cover for: " + title);
        } else {
            System.out.println("Book not found: " + title);
        }
    }
} 