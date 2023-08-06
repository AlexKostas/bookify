package com.bookify.messages;

import java.sql.Timestamp;

public record MessageResponseDTO(String senderUsername, String body, Timestamp timestamp) {}