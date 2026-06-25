package com.lendMe.item.dto;

import com.lendMe.item.entity.ItemCategory;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateItemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Item Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private ItemCategory category;

    @NotNull(message = "Daily price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal dailyPrice;
}