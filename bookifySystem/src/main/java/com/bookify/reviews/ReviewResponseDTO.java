package com.bookify.reviews;

public record ReviewResponseDTO(int stars, String comment, boolean reviewerVisitedRoom, String username) {}