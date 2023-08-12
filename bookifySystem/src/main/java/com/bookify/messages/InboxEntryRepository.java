package com.bookify.messages;

import com.bookify.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InboxEntryRepository  extends JpaRepository<InboxEntry, Long> {
    Optional<InboxEntry> findByConversationAndUser(Conversation conversation, User user);
}