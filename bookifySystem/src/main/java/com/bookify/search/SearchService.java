package com.bookify.search;

import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.room_amenities.Amenity;
import com.bookify.room_amenities.AmenityRepository;
import com.bookify.room_type.RoomType;
import com.bookify.room_type.RoomTypeRepository;
import com.bookify.utils.Utils;
import jakarta.persistence.criteria.Order;
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

    private enum OrderDirection {
        UP, DOWN
    }

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
                map((room) -> mapRoomToDTO(room, 1, 3)).toList();

        return new PageImpl<>(finalResult, pageable, searchResult.getTotalElements());
    }

    public Page<SearchPreviewDTO> search(int pageNumber, int pageSize, String sortDirection,
                                         SearchRequestDTO searchDTO){

        if(!sortDirection.equalsIgnoreCase("desc") && !sortDirection.equalsIgnoreCase("asc")) {
            log.warn("Unknown sorting direction '" + sortDirection + "'. Assuming ascending order. " +
                    "Please use 'asc' or 'desc' to specify the order of the search results");
        }

        OrderDirection direction = sortDirection.equalsIgnoreCase("desc") ?
                OrderDirection.DOWN : OrderDirection.UP;

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

        long nights = Utils.getDaysBetween(searchDTO.startDate(), searchDTO.endDate());

        // Unfortunately, due to the way JPA works it is not allowed to use named parameters in the order by clause
        // and although it works, it is non-standard, throws exceptions and could break at any moment. Since there is
        // no way to conveniently parameterize the order direction, two separate queries are needed
        Page<Room> searchResult = direction == OrderDirection.UP ?
                roomRepository.filterRoomsASC(
                        amenitiesFilter,
                        amenitiesFilter.size(),
                        searchDTO.startDate(),
                        searchDTO.endDate(),
                        nights,
                        roomTypesFilter,
                        roomTypesFilter.size(),
                        searchDTO.maxPrice(),
                        searchDTO.tenants(),
                        searchDTO.city(),
                        searchDTO.state(),
                        searchDTO.country(),
                        pageable
        ) : roomRepository.filterRoomsDESC(
                amenitiesFilter,
                amenitiesFilter.size(),
                searchDTO.startDate(),
                searchDTO.endDate(),
                nights,
                roomTypesFilter,
                roomTypesFilter.size(),
                searchDTO.maxPrice(),
                searchDTO.tenants(),
                searchDTO.city(),
                searchDTO.state(),
                searchDTO.country(),
                pageable);

        List<SearchPreviewDTO> finalResult = searchResult.getContent().stream().
                map((room) -> mapRoomToDTO(room, searchDTO.tenants(), nights)).toList();

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

    //TODO: refactor duplicated function
    private SearchPreviewDTO mapRoomToDTO(Room room, int tenants, long nights){
        return new SearchPreviewDTO(room.getRoomID(),
                room.getName(),
                room.getRating(),
                room.getReviewCount(),
                room.getNumOfBeds(),
                room.calculateCost(tenants, (int) nights),
                room.getRoomType().getName(),
                room.getThumbnail().getImageGuid());
    }
}