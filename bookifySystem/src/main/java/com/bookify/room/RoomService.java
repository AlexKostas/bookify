package com.bookify.room;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;

@Service
@AllArgsConstructor
public class RoomService{

    private RoomRepository roomRepository;

    private Room createRoom(RoomDTO roomDTO) throws OperationNotSupportedException {
        if (roomDTO.nBeds() < 1 || roomDTO.nBaths()<0 || roomDTO.sArea() < 2)
            throw new OperationNotSupportedException("Incompatible room fields");
        Room newR =  new Room(0,
                roomDTO.nBeds(),
                roomDTO.nBaths(),
                roomDTO.nBedrooms(),
                roomDTO.sArea(),
                roomDTO.descr()
        );
        return roomRepository.save(newR);
    }

    public RoomRegistrationResponseDTO registerRoom(RoomDTO roomDTO) throws OperationNotSupportedException {
        return new RoomRegistrationResponseDTO(createRoom(roomDTO).getRoomID());
    }

    public Room loadRoomDataById(int roomId) throws EntityNotFoundException {
        return roomRepository.findRoomByRoomID(roomId).orElseThrow(() -> new EntityNotFoundException("Room does" +
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