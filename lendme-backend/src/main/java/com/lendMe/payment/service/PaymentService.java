package com.lendMe.payment.service;

import com.lendMe.booking.entity.Booking;
import com.lendMe.booking.entity.BookingStatus;
import com.lendMe.booking.repository.BookingRepository;
import com.lendMe.payment.dto.PaymentRequest;
import com.lendMe.payment.dto.PaymentResponse;
import com.lendMe.payment.entity.Payment;
import com.lendMe.payment.entity.PaymentStatus;
import com.lendMe.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public PaymentResponse simulatePayment(PaymentRequest request, String email) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getBorrower().getEmail().equals(email)) {
            throw new RuntimeException("You are not the borrower of this booking");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Booking must be APPROVED before payment");
        }

        if (paymentRepository.existsByBookingId(booking.getId())) {
            throw new RuntimeException("Payment already made for this booking");
        }

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .transactionRef(UUID.randomUUID().toString())
                .status(PaymentStatus.SIMULATED)
                .build();

        booking.setStatus(BookingStatus.PAID);
        bookingRepository.save(booking);

        Payment saved = paymentRepository.save(payment);
        return toDto(saved);
    }

    private PaymentResponse toDto(Payment payment) {
        PaymentResponse dto = new PaymentResponse();
        dto.setId(payment.getId());
        dto.setBookingId(payment.getBooking().getId());
        dto.setAmount(payment.getAmount());
        dto.setTransactionRef(payment.getTransactionRef());
        dto.setStatus(payment.getStatus());
        dto.setPaidAt(payment.getPaidAt());
        return dto;
    }
}