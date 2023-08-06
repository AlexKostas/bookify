package com.bookify.booking;

import com.bookify.room.Room;
import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "booking_id")
    private int id;

    @OneToOne
    private Room room;

    @OneToOne
    private User user;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private LocalDate bookingDate;

    public Booking(Room room, User user, LocalDate checkInDate, LocalDate checkOutDate, LocalDate bookingDate) {
        this.room = room;
        this.user = user;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookingDate = bookingDate;
    }
}