package com.bookreview.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String cover;

    private Double rating;

    private String genre;

    @Column(length = 2000)
    private String description;

    private Integer publishedYear;

    private Integer pageCount;
} 