package com.bookify.booking;

import java.time.LocalDate;

public record BookingResponseDTO(int bookingNumber, LocalDate checkInDate, LocalDate checkOutDate, LocalDate bookingDate,
                                 String roomName, float price, int numberOfTenants) {}