package com.bookify.messages;

import java.sql.Timestamp;

public record ConversationResponseDTO(Long conversationID, String member1Username, String member2Username,
                                      String topic, boolean readonly, Timestamp lastUpdated) {}