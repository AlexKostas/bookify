package com.bookify.rooms_viewed;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViewedRoomRepository extends JpaRepository<ViewedRoom, Long> {

    @Query("SELECT new com.bookify.rooms_viewed.ViewedRoomDTO(v.user.userID, v.room.roomID, COUNT(*))" +
            "FROM ViewedRoom v " +
            "GROUP BY v.room.roomID, v.user.userID ")
    List<ViewedRoomDTO> getViewedRoomPairs();
}