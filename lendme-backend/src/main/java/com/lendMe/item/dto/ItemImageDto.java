package com.lendMe.item.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ItemImageDto {
    private UUID id;
    private String imageUrl;
    private Boolean isPrimary;
    private Integer sortOrder;
}