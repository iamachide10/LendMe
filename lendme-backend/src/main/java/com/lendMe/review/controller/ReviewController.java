package com.lendMe.review.controller;

import com.lendMe.review.dto.CreateReviewRequest;
import com.lendMe.review.dto.ReviewResponseDto;
import com.lendMe.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponseDto> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.createReview(request, userDetails.getUsername()));
    }

    @GetMapping("/item/{id}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByItem(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.getReviewsByItem(id));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByUser(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(id));
    }
}