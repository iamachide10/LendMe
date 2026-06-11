package com.lendMe.user.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserProfileDto {

    private UUID id;
    private String name;
    private String email;
    private String profilePhoto;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}