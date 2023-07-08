package com.bookify.room;

import jakarta.persistence.EntityNotFoundException;

import javax.naming.OperationNotSupportedException;

public interface RoomService {
    public int registerRoom(RoomDTO roomDTO) throws OperationNotSupportedException;
    public RoomResponseDTO loadRoomData(int roomId) throws EntityNotFoundException;
}
