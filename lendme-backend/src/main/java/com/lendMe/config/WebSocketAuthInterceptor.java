package com.lendMe.config;

import com.lendMe.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import java.security.Principal;



@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            System.out.println("=== WS CONNECT received ===");
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            System.out.println("Auth header present: " + (authHeader != null));

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    String email = jwtService.extractEmail(token);
                    System.out.println("Extracted email: " + email);

                    if (email != null && jwtService.isTokenValid(token, email)) {
                        Principal principal = () -> email;
                        accessor.setUser(principal);
                        System.out.println("=== WS AUTH SUCCESS: " + email + " ===");
                    } else {
                        System.out.println("=== WS AUTH FAILED: invalid token ===");
                    }
                } catch (Exception e) {
                    System.out.println("=== WS AUTH ERROR: " + e.getMessage() + " ===");
                }
            } else {
                System.out.println("=== WS AUTH FAILED: no Bearer header ===");
            }
        }

        return message;
    }
}