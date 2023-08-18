package com.bookify.reviews;

import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public Integer createReview(ReviewDTO reviewDTO, Integer roomID) throws EntityNotFoundException, OperationNotSupportedException {
        //TODO: when booking system is ready, make sure we update 'reviewerVisitedRoom' property correctly
        User currentUser = userRepository.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()).get();

        Room room = roomRepository.findById(roomID).
                orElseThrow(() -> new EntityNotFoundException("Room with id " + roomID + " does not exist!"));

        // Don't allow reviewer make more than one reviews on the same room. They should edit their existing one.
        if(reviewRepository.countByReviewerAndRoom(currentUser, room) > 0)
            throw new OperationNotSupportedException("Reviewer with id " + currentUser.getUserID() + " cannot review the same room with id " +
                    room.getRoomID() + ". They should edit their already existing review.");

        // Don't allow room's host to make a review on their room
        User roomHost = room.getRoomHost();
        if (roomHost.getUserID().equals(currentUser.getUserID()))
            throw new OperationNotSupportedException("Host user with id " + currentUser.getUserID() + " cannot review the room with id " +
                    room.getRoomID() + " because it belongs to their set of rooms.");

        Review review = reviewRepository.save(new Review(
                0,
                reviewDTO.stars(),
                reviewDTO.comment(),
                LocalDate.now(),
                false,
                currentUser,
                room
        ));

        return review.getReviewID();
    }

    public ReviewResponseDTO getReview(Integer reviewID) throws EntityNotFoundException {
        Review review = findReview(reviewID);

        return new ReviewResponseDTO(
                review.getStars(),
                review.getComment(),
                review.isReviewerVisitedRoom(),
                review.getReviewer().getUsername());
    }

    public List<ReviewResponseDTO> getAllReviews(Integer roomID) throws EntityNotFoundException {
        if(!roomRepository.findById(roomID).isPresent())
            throw new EntityNotFoundException("Room with id " + roomID + " not found");

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

    public void editReview(Integer reviewID, ReviewDTO reviewDTO) throws IllegalAccessException, EntityNotFoundException {
        Review review = findReview(reviewID);
        verifyReviewEditingPrivileges(review);

        review.setStars(reviewDTO.stars());
        review.setComment(reviewDTO.comment());

        reviewRepository.save(review);
    }

    public void deleteReview(Integer reviewID) throws IllegalAccessException, EntityNotFoundException {
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