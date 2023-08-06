package com.bookify.booking;

import java.time.LocalDate;

//TODO: add other attributes such as price and number of tenants
public record BookingResponseDTO(int bookingNumber, LocalDate checkInDate, LocalDate checkOutDate, LocalDate bookingDate,
                                 String roomName) {}
