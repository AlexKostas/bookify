package com.bookify.booking;

import com.bookify.availability.AvailabilityService;
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

@Service
@AllArgsConstructor
public class BookingService {

    private final AvailabilityService availabilityService;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UtilityComponent utility;

    @Transactional
    public byte[] book(BookingRequestDTO bookRequest) throws IllegalAccessException, IOException {
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

        BookingResponseDTO bookingResponse = new BookingResponseDTO(
                booking.getBookingNumber(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getBookingDate(),
                booking.getRoom().getName(),
                booking.getPrice(),
                booking.getNumberOfTenants()
        );

        return generateBookingPDF(bookingResponse, currentUser);
    }

    private byte[] generateBookingPDF(BookingResponseDTO bookingDTO, User user) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
                contentStream.showText("Bookify");
                contentStream.newLine();
                contentStream.endText();

                contentStream.beginText();
                contentStream.newLineAtOffset(100, 700);
                contentStream.showText("Booking Number: " + bookingDTO.bookingNumber());
                contentStream.newLine();
                contentStream.showText("Full Name: " + user.getFirstName() + " " + user.getLastName());
                contentStream.newLine();
                contentStream.showText("Check-In Date: " + bookingDTO.checkInDate());
                contentStream.newLine();
                contentStream.showText("Check-Out Date: " + bookingDTO.checkOutDate());
                contentStream.newLine();
                contentStream.showText("Booking Date: " + bookingDTO.bookingDate());
                contentStream.newLine();
                contentStream.showText("Room Name: " + bookingDTO.roomName());
                contentStream.newLine();
                contentStream.showText("Price: " + bookingDTO.price());
                contentStream.newLine();
                contentStream.showText("Number of Tenants: " + bookingDTO.numberOfTenants());
                contentStream.endText();
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }
}