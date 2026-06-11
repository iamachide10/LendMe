package com.lendMe.messaging.service;

import com.lendMe.messaging.dto.*;
import com.lendMe.messaging.entity.Conversation;
import com.lendMe.messaging.entity.Message;
import com.lendMe.messaging.repository.ConversationRepository;
import com.lendMe.messaging.repository.MessageRepository;
import com.lendMe.user.entity.User;
import com.lendMe.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public List<ConversationDto> getConversations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return conversationRepository.findByParticipant(user)
                .stream().map(c -> toConversationDto(c, user))
                .collect(Collectors.toList());
    }

    public List<MessageDto> getMessages(UUID conversationId) {
        return messageRepository.findByConversationIdOrderBySentAtAsc(conversationId)
                .stream().map(this::toMessageDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageDto sendMessage(SendMessageRequest request, String email) {
        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Conversation conversation = conversationRepository
                .findByParticipants(sender, receiver)
                .orElseGet(() -> conversationRepository.save(
                        Conversation.builder()
                                .participant1(sender)
                                .participant2(receiver)
                                .build()
                ));

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(request.getContent())
                .isRead(false)
                .build();

        return toMessageDto(messageRepository.save(message));
    }

    private ConversationDto toConversationDto(Conversation c, User currentUser) {
        ConversationDto dto = new ConversationDto();
        dto.setId(c.getId());
        User other = c.getParticipant1().getId().equals(currentUser.getId())
                ? c.getParticipant2() : c.getParticipant1();
        dto.setOtherUserId(other.getId());
        dto.setOtherUserName(other.getName());
        dto.setCreatedAt(c.getCreatedAt());
        return dto;
    }

    private MessageDto toMessageDto(Message m) {
        MessageDto dto = new MessageDto();
        dto.setId(m.getId());
        dto.setConversationId(m.getConversation().getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderName(m.getSender().getName());
        dto.setContent(m.getContent());
        dto.setIsRead(m.getIsRead());
        dto.setSentAt(m.getSentAt());
        return dto;
    }
}