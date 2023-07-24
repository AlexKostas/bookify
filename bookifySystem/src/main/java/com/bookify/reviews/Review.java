package com.bookify.reviews;

import com.bookify.room.Room;
import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

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
    private String comment;

    private boolean reviewerVisitedRoom;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "room_ID")
    private Room room;

    public Review() {}
}