package com.bookify.booking;

import com.bookify.room.Room;
import com.bookify.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    void deleteByRoom(Room room);

    List<Booking> findAllByRoom(Room room);

    int countByUserAndRoom(User user, Room room);
}