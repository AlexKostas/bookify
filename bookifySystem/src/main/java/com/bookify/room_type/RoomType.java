package com.bookify.room_type;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "room_types")
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_type_ID")
    private int id;

    private String name;

    public RoomType(String name) {
        this.name = name;
    }
}