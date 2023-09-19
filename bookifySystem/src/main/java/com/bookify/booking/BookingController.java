package com.bookify.booking;

import com.bookify.availability.AvailabilityService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/booking")
@AllArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final AvailabilityService availabilityService;

    @PostMapping("/book")
    @PreAuthorize("hasRole('tenant')")
    public ResponseEntity<?> book(@RequestBody BookingRequestDTO bookRequest){
        try{
            BookingResponseDTO bookingResult = bookingService.book(bookRequest);

            return new ResponseEntity<>(bookingResult, HttpStatus.OK);
        }
        catch (IllegalArgumentException | EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/isAvailable")
    public ResponseEntity<?> isAvailable(@RequestBody BookingRequestDTO bookRequest){
        try{
            boolean available = availabilityService.isRoomAvailable(bookRequest.roomID(),
                    bookRequest.checkInDate(), bookRequest.checkOutDate());

            return ResponseEntity.ok(new BookingCheckDTO(available));
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}