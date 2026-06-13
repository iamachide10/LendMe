package com.lendMe.messaging.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ConversationDto {

    private UUID id;
    private UUID otherUserId;
    private String otherUserName;
    private String lastMessage;
    private Integer unreadCount;
    private LocalDateTime createdAt;
}