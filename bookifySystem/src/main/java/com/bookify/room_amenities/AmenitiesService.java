package com.bookify.room_amenities;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AmenitiesService {
    private final AmenityRepository amenityRepository;

    public List<Amenity> getAllAmenities(){
        return amenityRepository.findAll();
    }
}