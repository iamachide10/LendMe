package com.lendMe.payment.service;

import com.lendMe.booking.entity.Booking;
import com.lendMe.booking.entity.BookingStatus;
import com.lendMe.booking.repository.BookingRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.lendMe.payment.dto.InitializePaymentResponse;
import com.lendMe.payment.dto.PaymentRequest;
import com.lendMe.payment.dto.PaymentResponse;
import com.lendMe.payment.entity.Payment;
import com.lendMe.payment.entity.PaymentStatus;
import com.lendMe.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PaystackClient paystackClient;

    @Value("${paystack.callback-url}")
    private String callbackUrl;

    @Transactional
    public InitializePaymentResponse initializePayment(PaymentRequest request, String email) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getBorrower().getEmail().equals(email)) {
            throw new RuntimeException("You are not the borrower of this booking");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Booking must be APPROVED before payment");
        }

        Payment payment = paymentRepository.findByBookingId(booking.getId()).orElse(null);
        if (payment != null && payment.getStatus() != PaymentStatus.PENDING
                && payment.getStatus() != PaymentStatus.FAILED) {
            throw new RuntimeException("Payment already made for this booking");
        }

        String reference = "LM-" + UUID.randomUUID();
        JsonNode data = paystackClient.initializeTransaction(
                email, booking.getTotalPrice(), reference, callbackUrl);

        if (payment == null) {
            payment = Payment.builder()
                    .booking(booking)
                    .amount(booking.getTotalPrice())
                    .transactionRef(reference)
                    .status(PaymentStatus.PENDING)
                    .paidAt(java.time.LocalDateTime.now())
                    .build();
        } else {
            payment.setTransactionRef(reference);
            payment.setAmount(booking.getTotalPrice());
            payment.setStatus(PaymentStatus.PENDING);
        }
        paymentRepository.save(payment);

        return new InitializePaymentResponse(
                data.path("authorization_url").asText(),
                data.path("access_code").asText(),
                reference,
                callbackUrl);
    }

    @Transactional
    public PaymentResponse verifyPayment(String reference, String email) {
        Payment payment = paymentRepository.findByTransactionRef(reference)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!payment.getBooking().getBorrower().getEmail().equals(email)) {
            throw new RuntimeException("You are not the borrower of this booking");
        }

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return toDto(payment);
        }

        JsonNode data = paystackClient.verifyTransaction(reference);
        String paystackStatus = data.path("status").asText();

        if ("success".equals(paystackStatus)) {
            markPaid(payment);
        } else if ("failed".equals(paystackStatus) || "abandoned".equals(paystackStatus)) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
        }
        return toDto(payment);
    }

    @Transactional
    public void handleWebhook(String rawBody, String signature) {
        if (!paystackClient.isValidWebhookSignature(rawBody, signature)) {
            throw new RuntimeException("Invalid webhook signature");
        }

        JsonNode payload = paystackClient.parseWebhookPayload(rawBody);
        if (!"charge.success".equals(payload.path("event").asText())) {
            return;
        }

        String reference = payload.path("data").path("reference").asText();
        paymentRepository.findByTransactionRef(reference).ifPresent(payment -> {
            if (payment.getStatus() != PaymentStatus.SUCCESS) {
                markPaid(payment);
            }
        });
    }

    private void markPaid(Payment payment) {
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(java.time.LocalDateTime.now());
        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.PAID);
        bookingRepository.save(booking);
        paymentRepository.save(payment);
    }

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
                .paidAt(java.time.LocalDateTime.now())
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