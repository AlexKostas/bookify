package com.bookify.room;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.naming.OperationNotSupportedException;

@RestController
@RequestMapping("/api/room")
@AllArgsConstructor
public class RoomController {

    private RoomService roomService;

    @GetMapping("/getRoom/{roomID}")
    public ResponseEntity getRoom(@PathVariable int roomID){
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

    @PostMapping("/registerRoom")
    public ResponseEntity registerRoom(@RequestBody RoomDTO roomDTO){
        try {
            RoomRegistrationResponseDTO result = roomService.registerRoom(roomDTO);
            return ResponseEntity.ok(result);
        } catch (OperationNotSupportedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}