package com.lendMe.messaging.controller;

import com.lendMe.messaging.dto.MessageDto;
import com.lendMe.messaging.dto.SendMessageRequest;
import com.lendMe.messaging.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.lendMe.user.repository.UserRepository;
import java.security.Principal;
import com.lendMe.user.entity.User;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserRepository userRepository;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request, Principal principal) {
        // Save to DB
        MessageDto saved = messageService.sendMessage(request, principal.getName());

        // Resolve receiver's email
        String receiverEmail = userRepository.findById(request.getReceiverId())
                .map(User::getEmail)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Push to sender (their own email = principal.getName())
        messagingTemplate.convertAndSendToUser(
            principal.getName(),
            "/queue/messages",
            saved
        );

        // Push to receiver
        messagingTemplate.convertAndSendToUser(
            receiverEmail,
            "/queue/messages",
            saved
        );
    }
}