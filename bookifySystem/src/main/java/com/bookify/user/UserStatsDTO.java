package com.bookify.user;

import java.time.LocalDate;

public record UserStatsDTO(String aboutInfo, LocalDate memberSince, int nReviews) {}
