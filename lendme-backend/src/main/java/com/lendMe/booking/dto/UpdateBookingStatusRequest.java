package com.lendMe.booking.dto;

import com.lendMe.booking.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBookingStatusRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;
}