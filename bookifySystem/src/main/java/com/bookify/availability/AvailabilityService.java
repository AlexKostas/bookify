package com.bookify.availability;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@AllArgsConstructor
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;

    public boolean IsRoomAvailable(int roomID, LocalDate startDate, LocalDate endDate){
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);
        return availabilityRepository.countAvailableDaysBetween(roomID, startDate, endDate) == daysBetween;
    }
}
