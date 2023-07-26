package com.bookify.room;

import com.bookify.images.Image;
import com.bookify.reviews.Review;
import com.bookify.room_amenities.Amenity;
import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
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

    // General Info
    private String name;
    private String summary;
    private String space;
    @Column(length = 3000)
    private String description;
    private String neighborhoodOverview;
    private String notes;
    private String transitInfo;

    // Address Info
    private String address;
    private String neighborhood;
    private String city;
    private String state;
    private String country;
    private String zipcode;

    private String latitude;
    private String longitude;

    // Booking info
    private int minimumStay;

    private int numOfBeds;
    private int numOfBaths;
    private int numOfBedrooms;
    private int surfaceArea;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "room_amenity_relationship",
                joinColumns = {@JoinColumn(name = "room_ID")},
                inverseJoinColumns = {@JoinColumn(name = "amenity_ID")})
    private Set<Amenity> amenities;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Image thumbnail;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Image> photos;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_host_id", nullable = false)
    private User roomHost;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public Room(String description, int numOfBeds, int numOfBaths, int numOfBedrooms,
                int surfaceArea, Set<Amenity> amenities, User roomHost) {
        this.description = description;
        this.numOfBeds = numOfBeds;
        this.numOfBaths = numOfBaths;
        this.numOfBedrooms = numOfBedrooms;
        this.surfaceArea = surfaceArea;
        this.amenities = amenities;
        this.roomHost = roomHost;

        this.thumbnail = null;
        this.photos = new ArrayList<>();
        this.reviews = new ArrayList<>();
    }

    public void addPhoto(Image newPhoto){
        photos.add(newPhoto);
    }

    public void deletePhoto(Image photoToDelete){
        photos.remove(photoToDelete);
    }

    public boolean containsPhoto(Image photo){
        return photos.contains(photo);
    }

    public float getRating(){
        //TODO: maybe use a more sophisticated algorithm that gives greater weight to more recent or verified reviews
        if(reviews.isEmpty()) return 0.0f;

        int count = 0;
        for(Review review : reviews)
            count += review.getStars();

        return (float) count / (float) getReviewCount();
    }

    public int getReviewCount(){
        return reviews.size();
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