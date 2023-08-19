package com.bookify.availability;

import com.bookify.room.RoomRepository;
import com.bookify.utils.Utils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final RoomRepository roomRepository;

    public boolean isRoomAvailable(int roomID, LocalDate startDate, LocalDate endDate){
        if(roomRepository.findById(roomID).isEmpty())
            throw new EntityNotFoundException("Room with id " + roomID + " not found");

        long daysBetween = Utils.getDaysBetween(startDate, endDate);
        return availabilityRepository.countAvailableDaysBetween(roomID, startDate, endDate) == daysBetween;
    }

    @Transactional
    public void markRoomAsUnavailable(int roomID, LocalDate startDate, LocalDate endDate){
        availabilityRepository.deleteAvailabilitiesForRoomBetweenDates(roomID, startDate, endDate);
    }
}