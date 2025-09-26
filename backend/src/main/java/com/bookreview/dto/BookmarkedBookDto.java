package com.bookreview.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookmarkedBookDto {
    private Long id;
    private String title;
    private String author;
    private String cover;
    private Double rating;
    private String genre;
    private LocalDateTime dateAdded;
} 