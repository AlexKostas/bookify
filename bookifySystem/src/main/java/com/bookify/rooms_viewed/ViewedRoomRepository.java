package com.bookify.rooms_viewed;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViewedRoomRepository extends JpaRepository<ViewedRoom, Long> {

}