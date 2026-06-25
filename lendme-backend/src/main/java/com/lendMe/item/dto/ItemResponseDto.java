package com.lendMe.item.dto;

import com.lendMe.item.entity.ItemCategory;
import lombok.Data;
import com.lendMe.item.dto.ItemImageDto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ItemResponseDto {

    private UUID id;
    private String title;
    private String description;
    private ItemCategory category;
    private BigDecimal dailyPrice;
    private Boolean isAvailable;
    private String ownerName;
    private UUID ownerId;
    private List<ItemImageDto> images;
    private LocalDateTime createdAt;
    // private <ItemImageDto>Images;
}