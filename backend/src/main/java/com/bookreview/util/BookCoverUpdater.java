package com.bookreview.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.bookreview.repository.BookRepository;
import com.bookreview.model.Book;
import java.util.Optional;

@Component
public class BookCoverUpdater implements CommandLineRunner {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Updating Book Covers ===");
        
        // Update The Great Gatsby
        updateBookCover("The Great Gatsby", "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg");
        
        // Update To Kill a Mockingbird
        updateBookCover("To Kill a Mockingbird", "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg");
        
        // Update 1984
        updateBookCover("1984", "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg");
        
        // Update Pride and Prejudice
        updateBookCover("Pride and Prejudice", "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg");
        
        // Update The Hobbit
        updateBookCover("The Hobbit", "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg");
        
        // Update The Catcher in the Rye
        updateBookCover("The Catcher in the Rye", "https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg");
        
        System.out.println("=== Book Covers Updated Successfully ===");
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
