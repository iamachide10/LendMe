package com.lendMe.review.repository;

import com.lendMe.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByItemId(UUID itemId);
    List<Review> findByRevieweeId(UUID revieweeId);
    boolean existsByBookingIdAndReviewerId(UUID bookingId, UUID reviewerId);
}