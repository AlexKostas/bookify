package com.bookify.room;

import com.bookify.room_amenities.Amenity;
import com.bookify.room_amenities.AmenityRepository;
import com.bookify.room_type.RoomType;
import com.bookify.room_type.RoomTypeRepository;
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

    //TODO: when host leaves/changes roles make sure his room entries are deleted/disabled

    private RoomRepository roomRepository;
    private AmenityRepository amenityRepository;
    private UserRepository userRepository;
    private RoomTypeRepository roomTypeRepository;
    private RoomAuthenticationUtility roomAuthenticationUtility;

    public Integer registerRoom(RoomRegistrationDTO roomDTO) throws OperationNotSupportedException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Room newRoom = createRoom(roomDTO, username);
        return newRoom.getRoomID();
    }

    public Integer editRoom(RoomRegistrationDTO roomDTO, Integer roomID) throws IllegalAccessException {
        Room room = roomRepository.findById(roomID)
                .orElseThrow(() -> new EntityNotFoundException("Room " + roomID + " not found"));

        assert(room.getRoomID() == roomID);

        roomAuthenticationUtility.verifyRoomEditingPrivileges(room);

        //TODO: keep this up to date with the new fields of rooms
        room.setNumOfBeds(roomDTO.nBeds());
        room.setNumOfBaths(roomDTO.nBaths());
        room.setNumOfBedrooms(roomDTO.nBedrooms());
        room.setSurfaceArea(roomDTO.surfaceArea());
        room.setDescription(roomDTO.description());
        room.setAmenities(generateAmenitiesSet(roomDTO.amenityIDs()));

        roomRepository.save(room);

        return roomID;
    }

    public RoomResponseDTO loadRoomData(Integer roomID) throws EntityNotFoundException {
        Room room = loadRoomDataById(roomID);

        assert(room.getRoomID() == roomID);
        return new RoomResponseDTO(
                room.getNumOfBeds(),
                room.getNumOfBaths(),
                room.getNumOfBedrooms(),
                room.getSurfaceArea(),
                room.getDescription(),
                getAmenitiesNames(room),
                getAmenitiesDescriptions(room),
                room.getThumbnail() != null ? room.getThumbnail().getImageGuid() : "",
                room.getLatitude(),
                room.getLongitude()
        );
    }

    public List<String> getRoomsOfHost(String username){
        return roomRepository.findRoomIDsByHostUsername(username);
    }

    public void deleteRoom(Integer roomID) throws IllegalAccessException {
        Room roomToDelete = roomRepository.findById(roomID)
                .orElseThrow(() -> new EntityNotFoundException("Room " + roomID + " not found"));

        assert(roomToDelete.getRoomID() == roomID);

        User host = roomToDelete.getRoomHost();

        roomAuthenticationUtility.verifyRoomEditingPrivileges(roomToDelete);

        host.unassignRoom(roomToDelete);
        userRepository.save(host);

        //TODO: delete any bookings for given room
        roomRepository.delete(roomToDelete);
    }

    private Room createRoom(RoomRegistrationDTO roomDTO, String hostUsername) throws OperationNotSupportedException {
        if (roomDTO.nBeds() < 1 || roomDTO.nBaths()<0 || roomDTO.surfaceArea() < 2)
            throw new OperationNotSupportedException("Incompatible room fields");

        assert(userRepository.findByUsername(hostUsername).isPresent());
        User host = userRepository.findByUsername(hostUsername).get();
        //TODO: test only thing, to be removed once script and room creation functionality is fully implemented
        RoomType roomType = roomTypeRepository.findByName("Private Room").get();

        Room newRoom =  new Room(
                roomDTO.description(),
                roomDTO.nBeds(),
                roomDTO.nBaths(),
                roomDTO.nBedrooms(),
                roomDTO.surfaceArea(),
                generateAmenitiesSet(roomDTO.amenityIDs()),
                roomType,
                host
        );

        Room savedRoom = roomRepository.save(newRoom);

        host.assignRoom(savedRoom);
        userRepository.save(host);

        return savedRoom;
    }

    private Room loadRoomDataById(int roomId) throws EntityNotFoundException {
        return roomRepository.findById(roomId).orElseThrow(() ->
                new EntityNotFoundException("Room " + roomId + " does not exist"));
    }

    private Set<Amenity> generateAmenitiesSet(List<Integer> amenityIDs){
        Set<Amenity> amenities = new HashSet<>();
        for(Integer amenityID : amenityIDs){
            Optional<Amenity> amenityOptional = amenityRepository.findById(amenityID);
            if(amenityOptional.isEmpty())
                throw new EntityNotFoundException("Amenity with ID " + amenityID + " not found");

            amenities.add(amenityOptional.get());
        }

        return amenities;
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