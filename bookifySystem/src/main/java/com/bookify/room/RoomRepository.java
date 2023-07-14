package com.bookify.room;

import com.bookify.room_amenities.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    Optional<Room> findRoomByRoomID(int roomId);
}