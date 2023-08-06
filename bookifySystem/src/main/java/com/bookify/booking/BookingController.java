package com.bookify.booking;

import com.bookify.availability.AvailabilityService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/booking")
@AllArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final AvailabilityService availabilityService;

    @GetMapping("/book")
    @PreAuthorize("hasRole('tenant')")
    public ResponseEntity<?> book(@RequestBody BookingRequestDTO bookRequest){
        try{
            return ResponseEntity.ok(bookingService.book(bookRequest));
        }
        catch (IllegalArgumentException | EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/isAvailable")
    public ResponseEntity<?> isAvailable(@RequestBody BookingRequestDTO bookRequest){
        try{
            return ResponseEntity.ok(availabilityService.isRoomAvailable(bookRequest.roomID(),
                    bookRequest.checkInDate(), bookRequest.checkOutDate()));
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}