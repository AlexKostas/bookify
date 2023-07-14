package com.bookify.room;

import com.bookify.room_amenities.Amenity;
import com.bookify.room_amenities.AmenityRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;
import java.util.*;

@Service
@AllArgsConstructor
public class RoomService{

    private RoomRepository roomRepository;
    private AmenityRepository amenityRepository;
    private UserRepository userRepository;

    public RoomRegistrationResponseDTO registerRoom(RoomRegistrationDTO roomDTO) throws OperationNotSupportedException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return new RoomRegistrationResponseDTO(createRoom(roomDTO, username).getRoomID());
    }

    public RoomResponseDTO loadRoomData(int roomId) throws EntityNotFoundException {
        Room room = loadRoomDataById(roomId);
        return new RoomResponseDTO(
                room.getNumOfBeds(),
                room.getNumOfBaths(),
                room.getNumOfBedrooms(),
                room.getSpaceArea(),
                room.getDescription(),
                getAmenitiesNames(room),
                getAmenitiesDescriptions(room)
        );
    }

    private Room createRoom(RoomRegistrationDTO roomDTO, String hostUsername) throws OperationNotSupportedException {
        if (roomDTO.nBeds() < 1 || roomDTO.nBaths()<0 || roomDTO.surfaceArea() < 2)
            throw new OperationNotSupportedException("Incompatible room fields");

        // Load amenities
        Set<Amenity> amenities = new HashSet<>();
        for(Integer amenityID : roomDTO.amenityIDs()){
            Optional<Amenity> amenityOptional = amenityRepository.findById(amenityID);
            if(amenityOptional.isEmpty())
                throw new EntityNotFoundException("Amenity with ID " + amenityID + " not found");

            amenities.add(amenityOptional.get());
        }

        User host = userRepository.findByUsername(hostUsername).get();

        Room newRoom =  new Room(0,
                roomDTO.nBeds(),
                roomDTO.nBaths(),
                roomDTO.nBedrooms(),
                roomDTO.surfaceArea(),
                roomDTO.description(),
                amenities,
                host
        );

        host.assignRoom(newRoom);

        return roomRepository.save(newRoom);
    }

    private Room loadRoomDataById(int roomId) throws EntityNotFoundException {
        return roomRepository.findRoomByRoomID(roomId).orElseThrow(() ->
                new EntityNotFoundException("Room " + roomId + " does not exist"));
    }

    private List<String> getAmenitiesNames(Room room){
        Set<Amenity> roomAmenities = room.getAmenities();
        List<String> result = new ArrayList<>();

        for (Amenity amenity : roomAmenities)
            result.add(amenity.getName());

        return result;
    }

    private List<String> getAmenitiesDescriptions(Room room){
        Set<Amenity> roomAmenities = room.getAmenities();
        List<String> result = new ArrayList<>();

        for (Amenity amenity : roomAmenities)
            result.add(amenity.getDescription());

        return result;
    }
}