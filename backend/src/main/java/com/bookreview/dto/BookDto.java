package com.bookreview.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BookDto {
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be at most 255 characters")
    private String title;

    @NotBlank(message = "Author is required")
    @Size(max = 255, message = "Author must be at most 255 characters")
    private String author;

    @Size(max = 500, message = "Cover URL must be at most 500 characters")
    private String cover;

    @DecimalMin(value = "0.0", inclusive = true, message = "Rating must be at least 0")
    @DecimalMax(value = "5.0", inclusive = true, message = "Rating must be at most 5")
    private Double rating;

    @Size(max = 100, message = "Genre must be at most 100 characters")
    private String genre;

    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @Min(value = 0, message = "Published year must be positive")
    private Integer publishedYear;

    @Min(value = 1, message = "Page count must be at least 1")
    private Integer pageCount;
} 