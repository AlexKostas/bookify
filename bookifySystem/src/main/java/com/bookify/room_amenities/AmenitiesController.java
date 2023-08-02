package com.bookify.room_amenities;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/amenities")
@AllArgsConstructor
public class AmenitiesController {

    private final AmenitiesService amenitiesService;

    @GetMapping("/getAllAmenities")
    public ResponseEntity<?> getAmenityIDs(){
        try {
            return ResponseEntity.ok(amenitiesService.getAllAmenities());
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}