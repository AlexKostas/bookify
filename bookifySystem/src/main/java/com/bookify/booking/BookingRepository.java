package com.bookify.booking;

import com.bookify.room.Room;
import com.bookify.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    void deleteByRoom(Room room);

    int countByUserIdAndRoomId(Long userId, int roomId);
}