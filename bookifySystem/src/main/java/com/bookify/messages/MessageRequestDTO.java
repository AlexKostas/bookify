package com.bookify.messages;

public record MessageRequestDTO(String recipientUsername, String topic, String body) {}
