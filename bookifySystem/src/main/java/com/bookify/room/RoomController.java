package com.bookify.room;

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
    //TODO: fix role based authentication when testing is done

    private RoomService roomService;

    @PostMapping("/registerRoom")
    @PreAuthorize("hasRole('tenant')")
    public ResponseEntity<?> registerRoom(@RequestBody RoomRegistrationDTO roomDTO){
        try {
            RoomRegistrationResponseDTO result = roomService.registerRoom(roomDTO);
            return ResponseEntity.ok(result);
        } catch (OperationNotSupportedException | EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getRoom/{roomID}")
    public ResponseEntity<?> getRoom(@PathVariable Integer roomID){
        try{
            return ResponseEntity.ok(roomService.loadRoomData(roomID));
        }
        catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/deleteRoom/{roomID}")
    @PreAuthorize("hasRole('admin') or hasRole('tenant')")
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