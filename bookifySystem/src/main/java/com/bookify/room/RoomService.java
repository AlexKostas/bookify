package com.bookify.room;

import com.bookify.availability.Availability;
import com.bookify.availability.AvailabilityRepository;
import com.bookify.booking.BookingRepository;
import com.bookify.configuration.Configuration;
import com.bookify.images.Image;
import com.bookify.images.ImageRepository;
import com.bookify.images.ImageStorage;
import com.bookify.room_amenities.Amenity;
import com.bookify.room_amenities.AmenityRepository;
import com.bookify.room_type.RoomType;
import com.bookify.room_type.RoomTypeRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;
import java.time.LocalDate;
import java.util.*;
import lombok.extern.slf4j.Slf4j;

import static com.bookify.utils.Constants.MAX_AVAILABILITY_DAYS_PER_ROOM;


@Slf4j
@Service
@AllArgsConstructor
public class RoomService{

    //TODO: when host leaves/changes roles make sure his room entries are deleted/disabled

    private final RoomRepository roomRepository;
    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BookingRepository bookingRepository;
    private final RoomAuthenticationUtility roomAuthenticationUtility;
    private final ImageRepository imageRepository;
    private final ImageStorage imageStorage;
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

        // delete old availability and update with new one
        availabilityRepository.deleteByRoom(room);
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
                room.getAmenityIDs(),
                room.getThumbnail().getImageGuid(),
                room.getPhotosGUIDs(),
                room.getRating(),
                room.getReviewCount()
        );
    }

    public Page<RoomDashboardDTO> getRoomsOfHost(String username, int pageNumber, int pageSize){
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Room> rooms = roomRepository.findByRoomHost_Username(username, pageable);

        List<RoomDashboardDTO> result = rooms.getContent().stream().map((room -> new RoomDashboardDTO(
                room.getRoomID(),
                room.getName(),
                room.getAddress()
        ))).toList();

        return new PageImpl<>(result, pageable, rooms.getTotalElements());
    }

    @Transactional
    public void deleteRoom(Integer roomID) throws IllegalAccessException {
        Room roomToDelete = roomRepository.findById(roomID)
                .orElseThrow(() -> new EntityNotFoundException("Room " + roomID + " not found"));

        assert(roomToDelete.getRoomID() == roomID);

        roomAuthenticationUtility.verifyRoomEditingPrivileges(roomToDelete);

        User host = roomToDelete.getRoomHost();

        host.unassignRoom(roomToDelete);    // deletes room from the set of rooms of given host
        userRepository.save(host);          // updates the host

        // delete any bookings for given room
        bookingRepository.deleteByRoom(roomToDelete);

        // delete availability rows of given room
        availabilityRepository.deleteByRoom(roomToDelete);

        // delete images of given room
        imageStorage.deleteImages(roomToDelete.getPhotos());
        if(!roomToDelete.getThumbnail().getImageGuid().equals(Configuration.DEFAULT_ROOM_THUMBNAIL_NAME))
            imageStorage.deleteImage(roomToDelete.getThumbnail());

        // finally delete the room
        roomRepository.delete(roomToDelete);
    }

    private Room createRoom(RoomRegistrationDTO roomDTO, String hostUsername) throws OperationNotSupportedException {
        if (
            roomDTO.name() == null       || roomDTO.summary() == null   || roomDTO.description() == null    ||
            roomDTO.zipcode() == null    || roomDTO.latitude() == null  || roomDTO.longitude() == null      ||
            roomDTO.minimumStay() < 1    || roomDTO.nBeds() < 1         || roomDTO.nBaths() < 0             ||
            roomDTO.surfaceArea() < 2    || roomDTO.accommodates() < 1  || roomDTO.country() == null        ||
            roomDTO.maxTenants() < 1     || roomDTO.pricePerNight() < 1 || roomDTO.extraCostPerTenant() < 0 ||
            roomDTO.amenityIDs() == null
        )
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
        List<Availability> availabilityList = new ArrayList<>(1500);
        int counter = 0;
        Boolean reachedMax = false;
        Set<LocalDate> usedDates = new HashSet<>();

        for(DatePairDTO datePair : availability){
            LocalDate date = datePair.startDate();

            while(!date.isAfter(datePair.endDate())){
                if(counter == MAX_AVAILABILITY_DAYS_PER_ROOM) {
                    log.warn("Maximum number of available booking dates is set to: "+ MAX_AVAILABILITY_DAYS_PER_ROOM);
                    reachedMax = true;
                    break;
                }

                if (!usedDates.contains(date)) {
                    availabilityList.add(new Availability(room, date));
                    usedDates.add(date);
                    counter++;
                }

                date = date.plusDays(1);
            }
            if(reachedMax)
                break;
        }
        availabilityRepository.saveAll(availabilityList);
        //TODO: Make sure duplicated entries do not cause a problem and are safely ignored
    }
}