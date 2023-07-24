package com.bookify.room;

import com.bookify.images.Image;
import com.bookify.room_amenities.Amenity;
import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
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
    private int surfaceArea;
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "room_amenity_relationship",
                joinColumns = {@JoinColumn(name = "room_ID")},
                inverseJoinColumns = {@JoinColumn(name = "amenity_ID")})
    private Set<Amenity> amenities;

    @OneToMany(fetch = FetchType.EAGER)
    private List<Image> photos;

    // TODO: rest of entity's attributes
    // check par. 6 and the end of par.5
    //private String roomCategory;

    // set of rules

    // address and geographical coordinates
    //    private Float latitude;
    //    private Float longitude;
    // private String address;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_host_id", nullable = false)
    private User roomHost;

    public void addPhoto(Image newPhoto){
        photos.add(newPhoto);
    }

    public void deletePhoto(Image photoToDelete){
        photos.remove(photoToDelete);
    }

    @Override
    public int hashCode(){
        return Objects.hash(roomID);
    }

    @Override
    public boolean equals(Object o){
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;

        Room otherRoom = (Room) o;
        return roomID == otherRoom.roomID;
    }
}