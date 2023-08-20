package com.bookify.reviews;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.naming.OperationNotSupportedException;

@RestController
@RequestMapping("api/reviews")
@AllArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/createReview/{roomID}")
    @PreAuthorize("hasRole('tenant')")
    public ResponseEntity<?> createReview(@PathVariable Integer roomID, @RequestBody ReviewDTO reviewDTO){
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(reviewDTO, roomID));
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (OperationNotSupportedException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getReview/{reviewID}")
    public ResponseEntity<?> getReview(@PathVariable Integer reviewID){
        try {
            return ResponseEntity.ok(reviewService.getReview(reviewID));
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getReviewOfUser/{roomID}")
    public ResponseEntity<?> getReviewOfUser(@PathVariable Integer roomID){
        try {
            return ResponseEntity.ok(reviewService.getReviewOfUser(roomID));
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getNReviews/{roomID}")
    public ResponseEntity<?> getNReviews(
            @PathVariable Integer roomID,
            @RequestParam(defaultValue = "5") int N){
        try {
            return ResponseEntity.ok(reviewService.getNReviews(roomID, N));
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/editReview/{reviewID}")
    @PreAuthorize("hasRole('tenant')")
    public ResponseEntity<?> editReview(@PathVariable Integer reviewID, @RequestBody ReviewDTO reviewDTO){
        try {
            reviewService.editReview(reviewID, reviewDTO);
            return ResponseEntity.ok().build();
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteReview/{reviewID}")
    @PreAuthorize("hasRole('tenant')")
    public ResponseEntity<?> deleteReview(@PathVariable Integer reviewID){
        try {
            reviewService.deleteReview(reviewID);
            return ResponseEntity.ok().build();
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}