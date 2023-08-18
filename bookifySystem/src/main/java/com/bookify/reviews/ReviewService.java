package com.bookify.reviews;

import com.bookify.booking.BookingRepository;
import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.UtilityComponent;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    private final UtilityComponent utility;


    public Integer createReview(ReviewDTO reviewDTO, Integer roomID) throws EntityNotFoundException {
        User currentUser = utility.getCurrentAuthenticatedUser();

        Room room = roomRepository.findById(roomID).
                orElseThrow(() -> new EntityNotFoundException("Room with id " + roomID + " does not exist!"));

        Review review = reviewRepository.save(new Review(
                0,
                reviewDTO.stars(),
                reviewDTO.comment(),
                LocalDate.now(),
                currentUser,
                room,
                hasReviewerVisitedRoom(currentUser, room)
        ));

        return review.getReviewID();
    }

    public ReviewResponseDTO getReview(Integer reviewID) throws EntityNotFoundException {
        Review review = findReview(reviewID);

        return new ReviewResponseDTO(
                review.getReviewID(),
                review.getStars(),
                review.getComment(),
                review.isReviewerVisitedRoom(),
                review.getReviewer().getUsername());
    }

    public ReviewResponseDTO getReviewOfUser(Integer roomID) throws EntityNotFoundException {
        Room room = roomRepository.findById(roomID).orElseThrow(() ->
                new EntityNotFoundException("Room with id " + roomID + " not found"));

        User user = utility.getCurrentAuthenticatedUser();

        Optional<Review> reviewOptional = reviewRepository.findByReviewerAndRoom(user, room);

        if(reviewOptional.isEmpty())
            throw new EntityNotFoundException("User " + user.getUsername() + " has no reviews for room with id " + roomID);

        Review review = reviewOptional.get();

        return new ReviewResponseDTO(
                review.getReviewID(),
                review.getStars(),
                review.getComment(),
                review.isReviewerVisitedRoom(),
                review.getReviewer().getUsername()
        );
    }

    public List<ReviewResponseDTO> getNReviews(Integer roomID, int reviewCount) throws EntityNotFoundException {
        if(!roomRepository.findById(roomID).isPresent())
            throw new EntityNotFoundException("Room with id " + roomID + " not found");

        List<Review> reviews = reviewRepository.findAllByRoomRoomID(roomID);
        List<ReviewResponseDTO> result = new ArrayList<>(reviews.size());
        int count = 0;

        for(Review review : reviews) {
            if(count >= reviewCount) break;

            result.add(new ReviewResponseDTO(
                    review.getReviewID(),
                    review.getStars(),
                    review.getComment(),
                    review.isReviewerVisitedRoom(),
                    review.getReviewer().getUsername()
            ));

            count++;
        }

        return result;
    }

    public void editReview(Integer reviewID, ReviewDTO reviewDTO) throws IllegalAccessException, EntityNotFoundException {
        Review review = findReview(reviewID);
        verifyReviewEditingPrivileges(review);

        review.setStars(reviewDTO.stars());
        review.setComment(reviewDTO.comment());

        User reviewer = review.getReviewer();
        Room roomReviewed = review.getRoom();
        review.setReviewerVisitedRoom(hasReviewerVisitedRoom(reviewer, roomReviewed));

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

    private Boolean hasReviewerVisitedRoom(User reviewer, Room roomReviewed) {
        return bookingRepository.countByUserAndRoom(reviewer, roomReviewed) > 0;
    }
}