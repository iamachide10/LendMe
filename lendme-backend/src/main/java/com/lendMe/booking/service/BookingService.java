package com.lendMe.booking.service;

import com.lendMe.booking.dto.*;
import com.lendMe.booking.entity.Booking;
import com.lendMe.booking.entity.BookingStatus;
import com.lendMe.booking.repository.BookingRepository;
import com.lendMe.item.entity.Item;
import com.lendMe.item.repository.ItemRepository;
import com.lendMe.user.entity.User;
import com.lendMe.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponseDto createBooking(CreateBookingRequest request, String email) {
        User borrower = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getIsAvailable()) {
            throw new RuntimeException("Item is not available");
        }

        if (item.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("You cannot book your own item");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date must be after start date");
        }

        if (bookingRepository.existsOverlappingBooking(
                item, request.getStartDate(), request.getEndDate())) {
            throw new RuntimeException("Item is already booked for selected dates");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        BigDecimal totalPrice = item.getDailyPrice().multiply(BigDecimal.valueOf(days));

        Booking booking = Booking.builder()
                .item(item)
                .borrower(borrower)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalPrice(totalPrice)
                .status(BookingStatus.PENDING)
                .build();

        return toDto(bookingRepository.save(booking));
    }

    public List<BookingResponseDto> getMyBookings(String email) {
        User borrower = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByBorrower(borrower)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<BookingResponseDto> getLenderBookings(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByItemOwner(owner)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDto updateStatus(UUID bookingId,
                                           UpdateBookingStatusRequest request,
                                           String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getItem().getOwner().getEmail().equals(email)) {
            throw new RuntimeException("You are not the owner of this item");
        }

        booking.setStatus(request.getStatus());
        return toDto(bookingRepository.save(booking));
    }

    @Transactional
    public void cancelBooking(UUID bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getBorrower().getEmail().equals(email)) {
            throw new RuntimeException("You are not the borrower of this booking");
        }

        if (booking.getStatus() == BookingStatus.ACTIVE ||
            booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel an active or completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private BookingResponseDto toDto(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(booking.getId());
        dto.setItemId(booking.getItem().getId());
        dto.setItemTitle(booking.getItem().getTitle());
        dto.setBorrowerId(booking.getBorrower().getId());
        dto.setBorrowerName(booking.getBorrower().getName());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}