package com.bookify.reviews;

import com.bookify.room.Room;
import com.bookify.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name="review_ID")
    private int reviewID;

    private int stars;
    @Column(length = 10000)
    private String comment;

    private LocalDate date;

    @ManyToOne(fetch = FetchType.EAGER)
    private User reviewer;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "room_ID")
    private Room room;

    private boolean reviewerVisitedRoom;

    public Review() {}
}