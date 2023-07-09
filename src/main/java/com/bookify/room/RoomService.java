package com.bookify.room;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;

@Service
@AllArgsConstructor
public class RoomService{

    private RoomRepository roomRepository;

    public int registerRoom(RoomDTO roomDTO) throws OperationNotSupportedException {
        Room newR =  new Room(0,
                roomDTO.nBeds(),
                roomDTO.nBaths(),
                roomDTO.nBedrooms(),
                roomDTO.sArea(),
                roomDTO.descr()
        );
        roomRepository.save(newR);
        return newR.getRoomID();
    }
    public Room loadRoomDataById(int roomId) throws EntityNotFoundException {
        return roomRepository.findRoom(roomId).orElseThrow(() -> new EntityNotFoundException("Room does" +
                "not exist"));
    }

    public RoomDTO loadRoomData(int roomId) throws EntityNotFoundException {
        Room room = loadRoomDataById(roomId);
        return new RoomDTO(
                room.getNumOfBeds(),
                room.getNumOfBaths(),
                room.getNumOfBedrooms(),
                room.getSpaceArea(),
                room.getDescription()
        );
    }
}