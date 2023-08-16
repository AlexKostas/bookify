package com.bookify.reviews;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findAllByRoomRoomID(int roomID);
    List<Review> findAllByReviewerUserID(Long userID);

    @Query("SELECT count(r) FROM Review r " +
            "WHERE r.reviewer.username = :username")
    int findNumberOfReviewsByUser(String username);
}