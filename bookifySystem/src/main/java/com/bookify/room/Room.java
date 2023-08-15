package com.bookify.room;

import com.bookify.images.Image;
import com.bookify.reviews.Review;
import com.bookify.room_amenities.Amenity;
import com.bookify.room_type.RoomType;
import com.bookify.user.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name="rooms")
public class Room {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name="room_ID")
    private int roomID;

    // General Info
    private String name;
    @Column(length =1000)
    private String summary;
    @Column(length = 5000)
    private String description;

    @Column(length = 2000)
    private String notes;

    // Address Info
    private String address;
    private String neighborhood;
    @Column(length = 1500)
    private String neighborhoodOverview;

    @Column(length = 2000)
    private String transitInfo;

    private String city;
    private String state;
    private String country;
    private String zipcode;

    private String latitude;
    private String longitude;

    // Rules
    private int minimumStay;
    @Column(length = 2000)
    private String rules;

    // Space info
    private int numOfBeds;
    private int numOfBaths;
    private int numOfBedrooms;
    private int surfaceArea;
    private int accommodates; // How many people can fit in the room

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    // Pricing info
    private float pricePerNight;
    private int maxTenants;
    private float extraCostPerTenant;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "room_amenity_relationship",
                joinColumns = {@JoinColumn(name = "room_ID")},
                inverseJoinColumns = {@JoinColumn(name = "amenity_ID")})
    private Set<Amenity> amenities;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Image thumbnail;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Image> photos;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_host_id", nullable = false)
    private User roomHost;

    @JsonManagedReference
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public Room(String name, String summary, String description, String notes, String address, String neighborhood,
                String neighborhoodOverview, String transitInfo, String city, String state, String country,
                String zipcode, String latitude, String longitude, int minimumStay, String rules, int numOfBeds,
                int numOfBaths, int numOfBedrooms, int surfaceArea, int accommodates, RoomType roomType,
                float pricePerNight, int maxTenants, float extraCostPerTenant, Set<Amenity> amenities,
                Image thumbnail, User roomHost) {
        this.name = name;
        this.summary = summary;
        this.description = description;
        this.notes = notes;
        this.address = address;
        this.neighborhood = neighborhood;
        this.neighborhoodOverview = neighborhoodOverview;
        this.transitInfo = transitInfo;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipcode = zipcode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.minimumStay = minimumStay;
        this.rules = rules;
        this.numOfBeds = numOfBeds;
        this.numOfBaths = numOfBaths;
        this.numOfBedrooms = numOfBedrooms;
        this.surfaceArea = surfaceArea;
        this.accommodates = accommodates;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.maxTenants = maxTenants;
        this.extraCostPerTenant = extraCostPerTenant;
        this.amenities = amenities;
        this.thumbnail = thumbnail;
        this.roomHost = roomHost;

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

    public float calculateCost(int numberOfTenants, int numberOfNights){
        assert(numberOfNights >= minimumStay);

        float extraCost = 0;
        if(numberOfTenants > maxTenants)
            extraCost = (numberOfTenants - maxTenants) * extraCostPerTenant;

        float costPerNight = pricePerNight + extraCost;
        return  costPerNight * numberOfNights;
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

    public List<String> getAmenitiesNames(){
        Set<Amenity> roomAmenities = this.getAmenities();
        List<String> result = new ArrayList<>();

        for (Amenity amenity : roomAmenities)
            result.add(amenity.getName());

        return result;
    }

    public List<String> getAmenitiesDescriptions(){
        Set<Amenity> roomAmenities = this.getAmenities();
        List<String> result = new ArrayList<>();

        for (Amenity amenity : roomAmenities)
            result.add(amenity.getDescription());

        return result;
    }

    public List<String> getphotosGUIDs() {
        List<Image> photos = this.getPhotos();
        List<String> result = new ArrayList<>();

        for (Image photo : photos)
            result.add(photo.getImageGuid());

        return result;
    }
}