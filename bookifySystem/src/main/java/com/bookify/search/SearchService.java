package com.bookify.search;

import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.room_amenities.Amenity;
import com.bookify.room_amenities.AmenityRepository;
import com.bookify.room_type.RoomType;
import com.bookify.room_type.RoomTypeRepository;
import com.bookify.utils.Utils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@AllArgsConstructor
public class SearchService {

    private final RoomRepository roomRepository;
    private final AmenityRepository amenityRepository;
    private final RoomTypeRepository roomTypeRepository;

    //TODO: to be deleted once the recommendation system is done
    public Page<SearchPreviewDTO> searchAll(int pageNumber, int pageSize, String sortDirection){
        // Ascending is assumed to be the default sorting direction, even when the relevant parameter is invalid
        Sort.Direction direction = Sort.Direction.ASC;
        if(sortDirection.equalsIgnoreCase("desc"))
            direction = Sort.Direction.DESC;

        if(!sortDirection.equalsIgnoreCase("desc") && !sortDirection.equalsIgnoreCase("asc"))
            log.warn("Unknown sorting direction '" + sortDirection + "'. Assuming ascending order. " +
                    "Please use 'asc' or 'desc' to specify the order of the search results");

        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<Room> searchResult = roomRepository.findAll(pageable);

        List<SearchPreviewDTO> finalResult = searchResult.getContent().stream().
                map(this::mapRoomToDTO).toList();

        return new PageImpl<>(finalResult, pageable, searchResult.getTotalElements());
    }

    public Page<SearchPreviewDTO> search(int pageNumber, int pageSize, String sortDirection,
                                         SearchRequestDTO searchDTO){
        Sort.Direction direction = Sort.Direction.ASC;
        if(sortDirection.equalsIgnoreCase("desc"))
            direction = Sort.Direction.DESC;

        if(!sortDirection.equalsIgnoreCase("desc") && !sortDirection.equalsIgnoreCase("asc"))
            log.warn("Unknown sorting direction '" + sortDirection + "'. Assuming ascending order. " +
                    "Please use 'asc' or 'desc' to specify the order of the search results");

        //TODO: Add sorting direction and property to sort by
        //TODO: filter by minimum stay, max price and other search filters
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Set<Amenity> amenitiesFilter = new HashSet<>();
        for(int amenityID : searchDTO.amenitiesIDs()){
            Optional<Amenity> amenityOptional = amenityRepository.findById(amenityID);
            if(!amenityOptional.isPresent()){
                log.warn("Skipping amenity with id " + amenityID + ". REASON: Amenity not found");
                continue;
            }

            amenitiesFilter.add(amenityOptional.get());
        }

        Set<RoomType> roomTypesFilter = new HashSet<>();
        for(Integer roomTypeID: searchDTO.roomTypesIDs()){
            Optional<RoomType> roomTypeOptional = roomTypeRepository.findById(roomTypeID);

            if(!roomTypeOptional.isPresent()){
                log.warn("Skipping room type with id " + roomTypeID + ". REASON: Room type not found");
                continue;
            }

            roomTypesFilter.add(roomTypeOptional.get());
        }

        Page<Room> searchResult = roomRepository.filterRooms(
                amenitiesFilter,
                amenitiesFilter.size(),
                searchDTO.startDate(),
                searchDTO.endDate(),
                Utils.getDaysBetween(searchDTO.startDate(), searchDTO.endDate()),
                roomTypesFilter,
                roomTypesFilter.size(),
                pageable
        );

        List<SearchPreviewDTO> finalResult = searchResult.getContent().stream().
                map(this::mapRoomToDTO).toList();

        return new PageImpl<>(finalResult, pageable, searchResult.getTotalElements());
    }

    public List<String> getAutocompleteLocationSuggestions(String input){
        List<String[]> result = roomRepository.findAutocompleteLocationSuggestions(input);

        List<String> suggestions = new ArrayList<>();
        for(String[] row : result){
            assert(row.length == 3);
            String suggestion = row[0] + ", " + row[1] + ", " + row[2];
            suggestions.add(suggestion);
        }

        return suggestions;
    }

    private SearchPreviewDTO mapRoomToDTO(Room room){
        //TODO: review this code when we have all the search parameters available
        return new SearchPreviewDTO(room.getRoomID(),
                room.getName(),
                room.getRating(),
                room.getReviewCount(),
                room.getNumOfBeds(),
                100,
                room.getRoomType().getName(),
                room.getThumbnail().getImageGuid());
    }
}