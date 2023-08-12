package com.bookify.availability;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    @Query("select count(a) from Availability a " +
            "where a.room.roomID = :roomID " +
            "and a.date >= :startDate and a.date < :endDate")
    long countAvailableDaysBetween(int roomID, LocalDate startDate, LocalDate endDate);

    @Modifying
    @Query("delete from Availability a " +
            "where a.room.roomID = :roomID " +
            "and a.date >= :startDate and a.date < :endDate")
    void deleteAvailabilitiesForRoomBetweenDates(int roomID, LocalDate startDate, LocalDate endDate);
}