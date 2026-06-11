package com.lendMe.booking.dto;

import com.lendMe.booking.entity.BookingStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class BookingResponseDto {

    private UUID id;
    private UUID itemId;
    private String itemTitle;
    private UUID borrowerId;
    private String borrowerName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private LocalDateTime createdAt;
}