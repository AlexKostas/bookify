package com.bookify.reviews;

import java.time.LocalDate;

public record ReviewResponseDTO(int reviewID, int stars, String comment, boolean reviewerVisitedRoom, String username, LocalDate date) {}