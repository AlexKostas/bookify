package com.bookify.booking;

import java.time.LocalDate;

public record BookingRequestDTO(int roomID, LocalDate checkInDate, LocalDate checkOutDate, int numberOfTenants) {}