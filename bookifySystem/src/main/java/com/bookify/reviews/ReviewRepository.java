package com.bookify.reviews;

import com.bookify.room.Room;
import com.bookify.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findAllByRoomRoomID(int roomID);
    List<Review> findAllByReviewerUserID(Long userID);

    int countByReviewerUsername(String username);

    int countByReviewerAndRoom(User reviewer, Room room);
}