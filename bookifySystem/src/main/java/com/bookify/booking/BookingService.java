package com.bookify.booking;

import com.bookify.availability.AvailabilityService;
import com.bookify.room.DatePairDTO;
import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.user.User;
import com.bookify.utils.UtilityComponent;
import com.bookify.utils.Utils;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class BookingService {

    private final AvailabilityService availabilityService;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UtilityComponent utility;

    @Transactional
    public BookingResponseDTO book(BookingRequestDTO bookRequest) throws IllegalAccessException, IOException {
        User currentUser = utility.getCurrentAuthenticatedUser();

        Room room = roomRepository.findById(bookRequest.roomID())
                .orElseThrow(() -> new IllegalArgumentException("Room with id " + bookRequest.roomID() + " not found"));

        if (!availabilityService.isRoomAvailable(bookRequest.roomID(),
                bookRequest.checkInDate(), bookRequest.checkOutDate()))
            throw new IllegalArgumentException("Room not available in specified days");

        if (currentUser.getUserID() == room.getRoomHost().getUserID())
            throw new IllegalAccessException("A host can not book their own room");

        if (Utils.getDaysBetween(bookRequest.checkInDate(), bookRequest.checkOutDate()) < room.getMinimumStay())
            throw new IllegalArgumentException("Stay is too short for this room");

        LocalDate now = LocalDate.now();

        if (bookRequest.checkInDate().isBefore(now))
            throw new IllegalArgumentException("Date " + bookRequest.checkInDate() + " is already past");

        if (bookRequest.checkOutDate().isBefore(now))
            throw new IllegalArgumentException("Date " + bookRequest.checkOutDate() + " is already past");

        if (bookRequest.checkOutDate().isBefore(bookRequest.checkInDate())
                || bookRequest.checkOutDate().equals(bookRequest.checkInDate()))
            throw new IllegalArgumentException("Checkout date needs to be after check in date");

        availabilityService.markRoomAsUnavailable(room.getRoomID(), bookRequest.checkInDate(), bookRequest.checkOutDate());

        Booking booking = new Booking(
                room,
                currentUser,
                bookRequest.checkInDate(),
                bookRequest.checkOutDate(),
                now,
                bookRequest.numberOfTenants(),
                room.calculateCost(
                        bookRequest.numberOfTenants(),
                        (int) Utils.getDaysBetween(bookRequest.checkInDate(), bookRequest.checkOutDate()))
        );

        bookingRepository.save(booking);

        return new BookingResponseDTO(
                booking.getBookingNumber(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getBookingDate(),
                booking.getRoom().getName(),
                booking.getPrice(),
                booking.getNumberOfTenants()
        );
    }

    public List<LocalDate> getBookedDaysForRoom(Room room){
        List<LocalDate> result = new ArrayList<>();

        List<Booking> bookings = bookingRepository.findAllByRoom(room);

        for(Booking booking : bookings)
            result.addAll(booking.getBookedDates());

        return result;
    }

    public List<DatePairDTO> getBookedDateRangesForRoom(Room room){
        List<DatePairDTO> result = new ArrayList<>();

        List<Booking> bookings = bookingRepository.findAllByRoom(room);

        for(Booking booking : bookings)
            result.add(booking.getBookedRange());

        return result;
    }
}