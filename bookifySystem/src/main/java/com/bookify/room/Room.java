package com.bookify.room;

import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name="rooms")
public class Room {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name="app_room_ID")
    private int roomID;

    // general info
    private int numOfBeds;
    private int numOfBaths;
    private int numOfBedrooms;
    private int spaceArea;
    private String description;

    // TODO: rest of entity's attributes
    // check par. 6 and the end of par.5
    //private String roomCategory;

    // set of rules

    // address and geographical coordinates
    //    private Float latitude;
    //    private Float longitude;
    // private String address;


//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "app_user_id", nullable = false)
//    private User host;

    public int getRoomID() {
        return roomID;
    }
}