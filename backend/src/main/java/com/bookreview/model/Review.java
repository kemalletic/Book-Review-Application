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

    @Column(name = "content", nullable = false, length = 2000)
    private String content;

    @Column(nullable = false)
    private LocalDateTime date;

    private int likes;

    @ElementCollection
    @CollectionTable(name = "review_images", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ElementCollection
    @CollectionTable(name = "review_videos", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "video_url")
    private List<String> videos;
} 