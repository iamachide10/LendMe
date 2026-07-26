package com.lendMe.payout.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.lendMe.booking.entity.Booking;
import com.lendMe.payment.service.PaystackClient;
import com.lendMe.payout.dto.PayoutResponseDto;
import com.lendMe.payout.entity.Payout;
import com.lendMe.payout.entity.PayoutStatus;
import com.lendMe.payout.repository.PayoutRepository;
import com.lendMe.user.entity.User;
import com.lendMe.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayoutService {

    private static final Logger log = LoggerFactory.getLogger(PayoutService.class);

    private final PayoutRepository payoutRepository;
    private final UserRepository userRepository;
    private final PaystackClient paystackClient;

    @Value("${paystack.platform-fee-percent:10}")
    private BigDecimal platformFeePercent;

    /**
     * Called when the borrower's payment is confirmed. Records the lender's
     * share as HELD in the platform balance until the rental completes.
     */
    @Transactional
    public void holdForBooking(Booking booking) {
        if (payoutRepository.findByBookingId(booking.getId()).isPresent()) {
            return;
        }
        BigDecimal gross = booking.getTotalPrice();
        BigDecimal fee = gross.multiply(platformFeePercent)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        Payout payout = Payout.builder()
                .booking(booking)
                .lender(booking.getItem().getOwner())
                .grossAmount(gross)
                .platformFee(fee)
                .netAmount(gross.subtract(fee))
                .status(PayoutStatus.HELD)
                .build();
        payoutRepository.save(payout);
    }

    /**
     * Called when the booking is marked COMPLETED. Sends the held amount
     * to the lender's MoMo wallet via Paystack Transfers.
     * No-op if there is no payout for the booking (e.g. simulated payment).
     */
    @Transactional
    public void releaseForBooking(UUID bookingId) {
        payoutRepository.findByBookingId(bookingId)
                .filter(p -> p.getStatus() == PayoutStatus.HELD)
                .ifPresent(this::initiateTransfer);
    }

    /**
     * Lender retries a FAILED payout after fixing their MoMo details.
     */
    @Transactional
    public PayoutResponseDto retryPayout(UUID payoutId, String email) {
        Payout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new RuntimeException("Payout not found"));

        if (!payout.getLender().getEmail().equals(email)) {
            throw new RuntimeException("You are not the lender for this payout");
        }
        if (payout.getStatus() != PayoutStatus.FAILED) {
            throw new RuntimeException("Only failed payouts can be retried");
        }
        initiateTransfer(payout);
        return toDto(payout);
    }

    private void initiateTransfer(Payout payout) {
        User lender = payout.getLender();
        if (lender.getPaystackRecipientCode() == null) {
            payout.setStatus(PayoutStatus.FAILED);
            payout.setFailureReason("Lender has not added mobile money details");
            payoutRepository.save(payout);
            return;
        }

        // A fresh reference per attempt: a previous failed attempt's reference
        // is already consumed on Paystack's side and cannot be reused.
        String reference = "LM-PO-" + UUID.randomUUID();
        payout.setTransferReference(reference);

        try {
            JsonNode data = paystackClient.initiateTransfer(
                    payout.getNetAmount(),
                    lender.getPaystackRecipientCode(),
                    reference,
                    "LendMe payout for booking " + payout.getBooking().getId());
            payout.setPaystackTransferCode(data.path("transfer_code").asText());
            payout.setStatus(PayoutStatus.RELEASED);
            payout.setReleasedAt(LocalDateTime.now());
            payout.setFailureReason(null);
        } catch (Exception e) {
            log.error("Transfer initiation failed for payout {}", payout.getId(), e);
            payout.setStatus(PayoutStatus.FAILED);
            payout.setFailureReason(e.getMessage());
        }
        payoutRepository.save(payout);
    }

    /**
     * Handles transfer.* webhook events from Paystack.
     */
    @Transactional
    public void handleTransferWebhook(String event, JsonNode data) {
        String reference = data.path("reference").asText();
        payoutRepository.findByTransferReference(reference).ifPresent(payout -> {
            switch (event) {
                case "transfer.success" -> {
                    payout.setStatus(PayoutStatus.PAID);
                    payout.setFailureReason(null);
                }
                case "transfer.failed", "transfer.reversed" -> {
                    payout.setStatus(PayoutStatus.FAILED);
                    payout.setFailureReason(data.path("reason").asText("Transfer " + event));
                }
                default -> { return; }
            }
            payoutRepository.save(payout);
        });
    }

    public List<PayoutResponseDto> getMyPayouts(String email) {
        User lender = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return payoutRepository.findByLenderOrderByCreatedAtDesc(lender)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private PayoutResponseDto toDto(Payout payout) {
        PayoutResponseDto dto = new PayoutResponseDto();
        dto.setId(payout.getId());
        dto.setBookingId(payout.getBooking().getId());
        dto.setItemTitle(payout.getBooking().getItem().getTitle());
        dto.setGrossAmount(payout.getGrossAmount());
        dto.setPlatformFee(payout.getPlatformFee());
        dto.setNetAmount(payout.getNetAmount());
        dto.setStatus(payout.getStatus());
        dto.setFailureReason(payout.getFailureReason());
        dto.setCreatedAt(payout.getCreatedAt());
        dto.setReleasedAt(payout.getReleasedAt());
        return dto;
    }
}
