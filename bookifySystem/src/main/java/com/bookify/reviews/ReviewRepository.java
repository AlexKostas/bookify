package com.bookify.reviews;

import com.bookify.room.Room;
import com.bookify.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findAllByRoomRoomID(int roomID);
    List<Review> findAllByReviewerUserID(Long userID);
    Optional<Review> findByReviewerAndRoom(User reviewer, Room room);

    int countByReviewerUsername(String username);

    @Query("SELECT AVG(r.stars) FROM Review r " +
            "INNER JOIN r.room rm " +
            "INNER JOIN rm.roomHost h " +
            "WHERE h =:host")
    Double calculateAverageStarsByHost(User host);

    @Query("SELECT COUNT(r) FROM Review r " +
            "INNER JOIN r.room rm " +
            "INNER JOIN rm.roomHost h " +
            "WHERE h =:host")
    int countByHost(User host);
}