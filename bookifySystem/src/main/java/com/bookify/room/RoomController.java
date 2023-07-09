package com.bookify.room;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.naming.OperationNotSupportedException;

@RestController
@RequestMapping("/api/room")
@AllArgsConstructor
public class RoomController {

    private RoomService roomService;

    @GetMapping("/getRoom")
    public RoomDTO getRoom(@RequestParam(name = "roomId") int roomId){
        // TODO: return appropriate response when id not exists
        return roomService.loadRoomData(roomId);
    }

    @PostMapping("/registerRoom")
    public int registerRoom(@RequestBody RoomDTO roomDTO) {
        try {
            int result = roomService.registerRoom(roomDTO);
            return result;
        } catch (OperationNotSupportedException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}