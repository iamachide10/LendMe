package com.lendMe.review.service;

import com.lendMe.booking.entity.Booking;
import com.lendMe.booking.entity.BookingStatus;
import com.lendMe.booking.repository.BookingRepository;
import com.lendMe.item.entity.Item;
import com.lendMe.item.repository.ItemRepository;
import com.lendMe.review.dto.CreateReviewRequest;
import com.lendMe.review.dto.ReviewResponseDto;
import com.lendMe.review.entity.Review;
import com.lendMe.review.repository.ReviewRepository;
import com.lendMe.user.entity.User;
import com.lendMe.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    @Transactional
    public ReviewResponseDto createReview(CreateReviewRequest request, String email) {
        User reviewer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("Booking must be COMPLETED to leave a review");
        }

        if (!booking.getBorrower().getId().equals(reviewer.getId())) {
            throw new RuntimeException("Only the borrower can leave a review");
        }

        if (reviewRepository.existsByBookingIdAndReviewerId(
                request.getBookingId(), reviewer.getId())) {
            throw new RuntimeException("You have already reviewed this booking");
        }

        User reviewee = userRepository.findById(request.getRevieweeId())
                .orElseThrow(() -> new RuntimeException("Reviewee not found"));

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        Review review = Review.builder()
                .booking(booking)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .item(item)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return toDto(reviewRepository.save(review));
    }

    public List<ReviewResponseDto> getReviewsByItem(UUID itemId) {
        return reviewRepository.findByItemId(itemId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ReviewResponseDto> getReviewsByUser(UUID userId) {
        return reviewRepository.findByRevieweeId(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private ReviewResponseDto toDto(Review review) {
        ReviewResponseDto dto = new ReviewResponseDto();
        dto.setId(review.getId());
        dto.setBookingId(review.getBooking().getId());
        dto.setReviewerId(review.getReviewer().getId());
        dto.setReviewerName(review.getReviewer().getName());
        dto.setRevieweeId(review.getReviewee().getId());
        dto.setRevieweeName(review.getReviewee().getName());
        dto.setItemId(review.getItem().getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}