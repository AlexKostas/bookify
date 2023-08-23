package com.bookify.room;

import com.bookify.configuration.Configuration;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.naming.OperationNotSupportedException;

@RestController
@RequestMapping("/api/room")
@AllArgsConstructor
public class RoomController {

    private RoomService roomService;

    @PostMapping("/registerRoom")
    @PreAuthorize("hasRole('host')")
    public ResponseEntity<?> registerRoom(@RequestBody RoomRegistrationDTO roomDTO){
        try {
            Integer result = roomService.registerRoom(roomDTO);
            return ResponseEntity.ok(result);
        } catch (OperationNotSupportedException | EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/editRoom/{roomID}")
    @PreAuthorize("hasRole('host')")
    public ResponseEntity<?> editRoom(@PathVariable Integer roomID, @RequestBody RoomRegistrationDTO roomDTO){
        try{
            return ResponseEntity.ok(roomService.editRoom(roomDTO, roomID));
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getRoom/{roomID}")
    public ResponseEntity<?> getRoom(
            @PathVariable Integer roomID,
            @RequestParam(defaultValue = "false") boolean getBookedDays){
        try{
            return ResponseEntity.ok(roomService.loadRoomData(roomID, getBookedDays));
        }
        catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/getRoomsOfHost/{username}")
    public ResponseEntity<?> getRoomsOfHost(
            @PathVariable String username,
            @RequestParam(defaultValue = Configuration.DEFAULT_PAGE_INDEX) int pageNumber,
            @RequestParam(defaultValue = Configuration.DEFAULT_PAGE_SIZE) int pageSize
    ){
        try {
            return ResponseEntity.ok(roomService.getRoomsOfHost(username, pageNumber, pageSize));
        }
        catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/deleteRoom/{roomID}")
    @PreAuthorize("hasRole('admin') or hasRole('host')")
    public ResponseEntity<?> deleteRoom(@PathVariable Integer roomID){
        try {
            roomService.deleteRoom(roomID);
            return ResponseEntity.ok("Room " + roomID + " deleted successfully");
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}