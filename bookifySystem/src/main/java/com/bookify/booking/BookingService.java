package com.bookify.booking;

import com.bookify.availability.AvailabilityService;
import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.UtilityComponent;
import com.bookify.utils.Utils;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class BookingService {

    private final AvailabilityService availabilityService;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UtilityComponent utility;

    @Transactional
    public BookingResponseDTO book(BookingRequestDTO bookRequest) throws IllegalAccessException {
        User currentUser = utility.getCurrentAuthenticatedUser();

        Room room = roomRepository.findById(bookRequest.roomID())
                .orElseThrow(() -> new IllegalArgumentException("Room with id " + bookRequest.roomID() + " not found"));

        if(!availabilityService.isRoomAvailable(bookRequest.roomID(),
                bookRequest.checkInDate(), bookRequest.checkOutDate()))
            throw new IllegalArgumentException("Room not available in specified days");

        if(currentUser.getUserID() == room.getRoomHost().getUserID())
            throw new IllegalAccessException("A host can not book their own room");

        if(Utils.getDaysBetween(bookRequest.checkInDate(), bookRequest.checkOutDate()) < room.getMinimumStay())
            throw new IllegalArgumentException("Stay is too short for this room");

        LocalDate now = LocalDate.now();

        if(bookRequest.checkInDate().isBefore(now))
            throw new IllegalArgumentException("Date " + bookRequest.checkInDate() + " is already past");

        if(bookRequest.checkOutDate().isBefore(now))
            throw new IllegalArgumentException("Date " + bookRequest.checkOutDate() + " is already past");

        if(bookRequest.checkOutDate().isBefore(bookRequest.checkInDate())
                || bookRequest.checkOutDate().equals(bookRequest.checkInDate()))
            throw new IllegalArgumentException("Checkout date needs to be after check in date");

        availabilityService.markRoomAsUnavailable(room.getRoomID(), bookRequest.checkInDate(), bookRequest.checkOutDate());

        Booking booking = new Booking(
                room,
                currentUser,
                bookRequest.checkInDate(),
                bookRequest.checkOutDate(),
                now,
                bookRequest.numberOfTenants());

        bookingRepository.save(booking);

        return new BookingResponseDTO(
                booking.getBookingNumber(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getBookingDate(),
                booking.getRoom().getName()
        );
    }
}