package com.lendMe.payout.dto;

import com.lendMe.payout.entity.PayoutStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class PayoutResponseDto {
    private UUID id;
    private UUID bookingId;
    private String itemTitle;
    private BigDecimal grossAmount;
    private BigDecimal platformFee;
    private BigDecimal netAmount;
    private PayoutStatus status;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime releasedAt;
}
