package com.bookify.room;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;

@Service
@AllArgsConstructor
public class RoomServiceImp implements RoomService{

    private RoomRepository roomRepository;

    @Override
    public int registerRoom(RoomDTO roomDTO) throws OperationNotSupportedException {
        Room newR =  new Room(0,
                roomDTO.nBeds(),
                roomDTO.nBaths(),
                roomDTO.nBedrooms(),
                roomDTO.livingRoom(),
                roomDTO.sArea(),
                roomDTO.descr(),
                roomDTO.rCategory(),
                roomDTO.descr(),
                roomDTO.rHost()
        );
        roomRepository.save(newR);
        return newR.getRoomID();
    }
    public Room loadRoomDataById(int roomId) throws EntityNotFoundException {
        return roomRepository.findRoom(roomId).orElseThrow(() -> new EntityNotFoundException("Room does" +
                "not exist"));
    }

    @Override
    public RoomResponseDTO loadRoomData(int roomId) throws EntityNotFoundException {
        Room room = loadRoomDataById(roomId);
        return new RoomResponseDTO(
                room.getNumOfBeds(),
                room.getNumOfBaths(),
                room.getNumOfBedrooms(),
                room.isExistsLivingRoom(),
                room.getSpaceArea(),
                room.getDescription(),
                room.getRoomCategory(),
                room.getAddress(),
                room.getHost()
        );
    }
}