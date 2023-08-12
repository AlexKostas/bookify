package com.bookify.room_type;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {}