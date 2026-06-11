package com.lendMe.payment.dto;

import com.lendMe.payment.entity.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PaymentResponse {

    private UUID id;
    private UUID bookingId;
    private BigDecimal amount;
    private String transactionRef;
    private PaymentStatus status;
    private LocalDateTime paidAt;
}