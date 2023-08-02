package com.bookify.room_amenities;

import com.bookify.room.Room;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

// Extra things a room can offer such as Wi-Fi, parking etc.
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "amenities")
public class Amenity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "amenity_ID")
    private int id;

    public Amenity(String name, String description) {
        this.name = name;
        this.description = description;
    }

    private String name;
    private String description;
}