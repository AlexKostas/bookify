package com.bookify.messages;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c, InboxEntry e " +
            "WHERE (c.member1.userID = :userID or c.member2.userID = :userID) " +
            "AND e.conversation.conversationID = c.conversationID " +
            "AND e.user.userID = :userID " +
            "AND e.isDeleted = false ")
    Page<Conversation> findAllConversationsOfUser(Long userID, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Conversation c, InboxEntry e " +
            "WHERE (c.member1.userID = :userID or c.member2.userID = :userID) " +
            "AND e.conversation.conversationID = c.conversationID " +
            "AND e.user.userID = :userID " +
            "AND e.isDeleted = false " +
            "AND e.isRead = false")
    int getNumberOfUnreadMessagesOfUser(Long userID);
}