package com.lendMe.messaging.repository;

import com.lendMe.messaging.entity.Conversation;
import com.lendMe.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    @Query("SELECT c FROM Conversation c WHERE c.participant1 = :user OR c.participant2 = :user")
    List<Conversation> findByParticipant(@Param("user") User user);

    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.participant1 = :user1 AND c.participant2 = :user2) OR " +
           "(c.participant1 = :user2 AND c.participant2 = :user1)")
    Optional<Conversation> findByParticipants(@Param("user1") User user1,
                                               @Param("user2") User user2);
}