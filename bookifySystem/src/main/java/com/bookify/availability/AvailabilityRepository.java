package com.bookify.availability;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    @Query("select count(a) from Availability a " +
            "where a.room.roomID = :roomID " +
            "and a.date >= :startDate and a.date < :endDate")
    long countAvailableDaysBetween(int roomID, LocalDate startDate, LocalDate endDate);

    //TODO:   delete this comment after read:
    //    The query below is a native query (check it out). I found the use of it mandatory
    //    for the '*' character. If you find a better way to do this, you might as well change it.
    @Query(
        value = "select * from Availability  a " +
                "where a.room.roomID = :roomID",
        nativeQuery = true)
    List<Availability> findAvailabilitiesByRoomId(int roomID);

    @Modifying
    @Query("delete from Availability a " +
            "where a.room.roomID = :roomID " +
            "and a.date >= :startDate and a.date < :endDate")
    void deleteAvailabilitiesForRoomBetweenDates(int roomID, LocalDate startDate, LocalDate endDate);
}