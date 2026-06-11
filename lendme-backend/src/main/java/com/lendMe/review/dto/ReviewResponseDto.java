package com.lendMe.review.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReviewResponseDto {

    private UUID id;
    private UUID bookingId;
    private UUID reviewerId;
    private String reviewerName;
    private UUID revieweeId;
    private String revieweeName;
    private UUID itemId;
    private Short rating;
    private String comment;
    private LocalDateTime createdAt;
}