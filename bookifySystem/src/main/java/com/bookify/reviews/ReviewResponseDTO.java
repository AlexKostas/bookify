package com.bookify.reviews;

public record ReviewResponseDTO(int reviewID, int stars, String comment, boolean reviewerVisitedRoom, String username) {}