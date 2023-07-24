package com.bookify.reviews;

import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public Integer createReview(ReviewDTO reviewDTO, Integer roomID) {
        //TODO: when booking system is ready, make sure we update 'reviewerVisitedRoom' property correctly
        User currentUser = userRepository.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()).get();

        Room room = roomRepository.findById(roomID).
                orElseThrow(() -> new EntityNotFoundException("Room with id " + roomID + " does not exist!"));

        Review review = reviewRepository.save(new Review(
                0,
                reviewDTO.stars(),
                reviewDTO.comment(),
                false,
                currentUser,
                room
        ));

        return review.getReviewID();
    }

    public ReviewResponseDTO getReview(Integer reviewID) {
        Review review = findReview(reviewID);

        return new ReviewResponseDTO(
                review.getStars(),
                review.getComment(),
                review.isReviewerVisitedRoom(),
                review.getReviewer().getUsername());
    }

    public List<ReviewResponseDTO> getAllReviews(Integer roomID){
        List<Review> reviews = reviewRepository.findAllByRoomRoomID(roomID);
        List<ReviewResponseDTO> result = new ArrayList<>(reviews.size());

        for(Review review : reviews)
            result.add(new ReviewResponseDTO(
                    review.getStars(),
                    review.getComment(),
                    review.isReviewerVisitedRoom(),
                    review.getReviewer().getUsername()
            ));

        return result;
    }

    public void editReview(Integer reviewID, ReviewDTO reviewDTO) throws IllegalAccessException {
        Review review = findReview(reviewID);
        verifyReviewEditingPrivileges(review);

        review.setStars(reviewDTO.stars());
        review.setComment(reviewDTO.comment());

        reviewRepository.save(review);
    }

    public void deleteReview(Integer reviewID) throws IllegalAccessException {
        Review review = findReview(reviewID);
        verifyReviewEditingPrivileges(review);

        reviewRepository.delete(review);
    }

    private Review findReview(Integer reviewID) throws EntityNotFoundException {
        return reviewRepository.findById(reviewID).
                orElseThrow(() -> new EntityNotFoundException("Review with id " + reviewID + " not found"));
    }

    private void verifyReviewEditingPrivileges(Review review) throws IllegalAccessException {
        User currentUser = userRepository.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()).get();

        Long reviewerID = review.getReviewer().getUserID();

        if(reviewerID != currentUser.getUserID() && !currentUser.isAdmin())
            throw new IllegalAccessException("Insufficient privileges to edit/delete review " +
                    review.getReviewID());
    }
}