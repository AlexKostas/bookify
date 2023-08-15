package com.bookify.room;

import com.bookify.availability.Availability;
import com.bookify.availability.AvailabilityRepository;
import com.bookify.configuration.Configuration;
import com.bookify.images.Image;
import com.bookify.images.ImageRepository;
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
import java.time.LocalDate;
import java.util.*;

@Service
@AllArgsConstructor
public class RoomService{

    //TODO: when host leaves/changes roles make sure his room entries are deleted/disabled

    private final RoomRepository roomRepository;
    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomAuthenticationUtility roomAuthenticationUtility;
    private final ImageRepository imageRepository;
    private final AvailabilityRepository availabilityRepository;

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
        room.setName(roomDTO.name());
        room.setSummary(roomDTO.summary());
        room.setDescription(roomDTO.description());
        room.setNotes(roomDTO.notes());
        room.setAddress(roomDTO.address());
        room.setNeighborhood(roomDTO.neighborhood());
        room.setNeighborhoodOverview(roomDTO.neighborhoodOverview());
        room.setTransitInfo(roomDTO.transitInfo());
        room.setCity(roomDTO.city());
        room.setState(roomDTO.state());
        room.setCountry(roomDTO.country());
        room.setZipcode(roomDTO.zipcode());
        room.setLatitude(roomDTO.latitude());
        room.setLongitude(roomDTO.longitude());
        room.setMinimumStay(roomDTO.minimumStay());
        room.setRules(roomDTO.rules());
        room.setNumOfBeds(roomDTO.nBeds());
        room.setNumOfBaths(roomDTO.nBaths());
        room.setNumOfBedrooms(roomDTO.nBedrooms());
        room.setSurfaceArea(roomDTO.surfaceArea());
        room.setAccommodates(roomDTO.accommodates());
        room.setRoomType(getRoomType(roomDTO.roomTypeID()));
        room.setPricePerNight(roomDTO.pricePerNight());
        room.setMaxTenants(roomDTO.maxTenants());
        room.setExtraCostPerTenant(roomDTO.extraCostPerTenant());
        room.setAmenities(generateAmenitiesSet(roomDTO.amenityIDs()));
        setAvailability(roomDTO.availability(), room);
        roomRepository.save(room);

        return roomID;
    }

    public RoomResponseDTO loadRoomData(Integer roomID) throws EntityNotFoundException {
        Room room = loadRoomDataById(roomID);

        assert(room.getRoomID() == roomID);
        return new RoomResponseDTO(
                room.getRoomHost().getUsername(),
                room.getName(),
                room.getSummary(),
                room.getDescription(),
                room.getNotes(),
                room.getAddress(),
                room.getNeighborhood(),
                room.getNeighborhoodOverview(),
                room.getTransitInfo(),
                room.getCity(),
                room.getState(),
                room.getCountry(),
                room.getZipcode(),
                room.getLatitude(),
                room.getLongitude(),
                room.getMinimumStay(),
                room.getRules(),
                room.getNumOfBeds(),
                room.getNumOfBaths(),
                room.getNumOfBedrooms(),
                room.getSurfaceArea(),
                room.getRoomID(),
                room.getRoomType().getName(),
                room.getPricePerNight(),
                room.getMaxTenants(),
                room.getExtraCostPerTenant(),
                room.getAmenitiesNames(),
                room.getAmenitiesDescriptions(),
                room.getThumbnail().getImageGuid(),
                room.getphotosGUIDs()
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
        //TODO: maybe some more error handling here
        if (roomDTO.nBeds() < 1 || roomDTO.nBaths()<0 || roomDTO.surfaceArea() < 2)
            throw new OperationNotSupportedException("Incompatible room fields");

        assert(userRepository.findByUsername(hostUsername).isPresent());
        User host = userRepository.findByUsername(hostUsername).get();
        Image defaultThumbnail = imageRepository.findByImageGuid(Configuration.DEFAULT_ROOM_THUMBNAIL_NAME).get();

        Room newRoom = new Room(
                roomDTO.name(),
                roomDTO.summary(),
                roomDTO.description(),
                roomDTO.notes(),
                roomDTO.address(),
                roomDTO.neighborhood(),
                roomDTO.neighborhoodOverview(),
                roomDTO.transitInfo(),
                roomDTO.city(),
                roomDTO.state(),
                roomDTO.country(),
                roomDTO.zipcode(),
                roomDTO.latitude(),
                roomDTO.longitude(),
                roomDTO.minimumStay(),
                roomDTO.rules(),
                roomDTO.nBeds(),
                roomDTO.nBaths(),
                roomDTO.nBedrooms(),
                roomDTO.surfaceArea(),
                roomDTO.accommodates(),
                getRoomType(roomDTO.roomTypeID()),
                roomDTO.pricePerNight(),
                roomDTO.maxTenants(),
                roomDTO.extraCostPerTenant(),
                generateAmenitiesSet(roomDTO.amenityIDs()),
                defaultThumbnail,
                host
        );

        Room savedRoom = roomRepository.save(newRoom);

        host.assignRoom(savedRoom);
        userRepository.save(host);

        setAvailability(roomDTO.availability(), savedRoom);

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


    private RoomType getRoomType(int roomTypeID){
        Optional<RoomType> roomTypeOptional = roomTypeRepository.findById(roomTypeID);
        if(roomTypeOptional.isEmpty())
            throw new EntityNotFoundException("Room Type with ID " + roomTypeID + " not found");

        return roomTypeOptional.get();
    }

    private void setAvailability(List<DatePairDTO> availability, Room room){
        for(DatePairDTO datePair : availability){
            LocalDate date = datePair.startDate();

            while(!date.isAfter(datePair.endDate())){
                availabilityRepository.save(new Availability(room, date));
                date = date.plusDays(1);
            }
        }
    }
}