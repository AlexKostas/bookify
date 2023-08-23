package com.bookify.booking;

import com.bookify.availability.Availability;
import com.bookify.room.DatePairDTO;
import com.bookify.room.Room;
import com.bookify.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static com.bookify.utils.Constants.MAX_AVAILABILITY_DAYS_PER_ROOM;

@Entity
@Getter
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int bookingNumber;

    @JsonBackReference
    @ManyToOne
    private Room room;

    @ManyToOne
    private User user;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private LocalDate bookingDate;
    private int numberOfTenants;
    private float price;

    public Booking(Room room, User user, LocalDate checkInDate, LocalDate checkOutDate,
                   LocalDate bookingDate, int numberOfTenants, float price) {
        this.room = room;
        this.user = user;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookingDate = bookingDate;
        this.numberOfTenants = numberOfTenants;
        this.price = price;
    }

    public List<LocalDate> getBookedDates() {
        List<LocalDate> results = new ArrayList<>();

        LocalDate date = checkInDate;
        while(!date.isAfter(checkOutDate)){
            results.add(date);
            date = date.plusDays(1);
        }

        return results;
    }

    public DatePairDTO getBookedRange() {
        return new DatePairDTO(checkInDate, checkOutDate);
    }
}