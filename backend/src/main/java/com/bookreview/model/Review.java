package com.bookreview.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String userName;

    private String userAvatar;

    @Column(nullable = false)
    private int rating;

    @Column(length = 2000)
    private String comment;

    private LocalDateTime date;

    private int likes;

    @ElementCollection
    private List<String> images;

    @ElementCollection
    private List<String> videos;
} 