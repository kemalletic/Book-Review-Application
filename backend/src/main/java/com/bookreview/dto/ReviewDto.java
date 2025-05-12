package com.bookreview.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReviewDto {
    private Long id;
    private Long bookId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private int rating;
    private String comment;
    private LocalDateTime date;
    private int likes;
    private List<String> images;
    private List<String> videos;
} 