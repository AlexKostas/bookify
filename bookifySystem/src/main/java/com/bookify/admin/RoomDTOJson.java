package com.bookify.admin;

import com.bookify.reviews.Review;

import java.util.List;


public record RoomDTOJson(
        int roomID,     String name,    String address,
        List<Review> reviews
) {
        public RoomDTOJson(com.bookify.room.Room room) {
                this(room.getRoomID(), room.getName(),
                        room.getAddress(), room.getReviews());
        }
}
