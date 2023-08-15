package com.bookify.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    //TODO:   delete this comment after read:
    //    The query below is a native query (check it out). I found the use of it mandatory
    //    for the '*' character. If you find a better way to do this, you might as well change it.
    @Query(
        value = "select * from Booking b " +
                "where b.room.roomID = :roomID",
        nativeQuery = true)
    List<Booking> findByRoomId(int roomID);
}