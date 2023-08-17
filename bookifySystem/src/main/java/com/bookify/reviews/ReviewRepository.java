package com.bookify.reviews;

import com.bookify.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findAllByRoomRoomID(int roomID);
    List<Review> findAllByReviewerUserID(Long userID);
    int countByReviewerUsername(String username);

    @Query("SELECT AVG(r.stars) FROM Review r " +
            "INNER JOIN r.room rm INNER JOIN rm.roomHost h " +
            "WHERE h =:host")
    Double calculateAverageStarsByHost(User host);
}