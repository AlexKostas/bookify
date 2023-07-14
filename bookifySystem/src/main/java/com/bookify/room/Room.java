package com.bookify.room;

import com.bookify.room_amenities.Amenity;
import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="rooms")
public class Room {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name="room_ID")
    private int roomID;

    // general info
    private int numOfBeds;
    private int numOfBaths;
    private int numOfBedrooms;
    private int spaceArea;
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "room_amenity_relationship",
                joinColumns = {@JoinColumn(name = "room_ID")},
                inverseJoinColumns = {@JoinColumn(name = "amenity_ID")})
    private Set<Amenity> amenities;

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
}