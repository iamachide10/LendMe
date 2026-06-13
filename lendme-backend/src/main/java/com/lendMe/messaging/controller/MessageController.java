package com.lendMe.messaging.controller;

import com.lendMe.messaging.dto.*;
import com.lendMe.messaging.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<List<ConversationDto>> getConversations(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(messageService.getConversations(userDetails.getUsername()));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable UUID id) {
        return ResponseEntity.ok(messageService.getMessages(id));
    }

    @PostMapping("/send")
    public ResponseEntity<MessageDto> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(messageService.sendMessage(request, userDetails.getUsername()));
    }

    @PostMapping("/start/{receiverId}")
    public ResponseEntity<ConversationDto> startConversation(
            @PathVariable UUID receiverId,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                messageService.startConversation(
                        receiverId,
                        userDetails.getUsername()
                )
        );
    }


    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
        @PathVariable UUID id,
        @AuthenticationPrincipal UserDetails userDetails) {
    messageService.markAsRead(id, userDetails.getUsername());
    return ResponseEntity.noContent().build();
}
}