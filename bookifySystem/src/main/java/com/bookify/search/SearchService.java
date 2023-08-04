package com.bookify.search;

import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class SearchService {

    private final RoomRepository roomRepository;

public Page<SearchPreviewDTO> searchAll(int pageNumber, int pageSize, String sortDirection){
        // Ascending is assumed to be the default sorting direction, even when the relevant parameter is invalid
        Sort.Direction direction = Sort.Direction.ASC;
        if(sortDirection.equalsIgnoreCase("desc"))
            direction = Sort.Direction.DESC;

        if(!sortDirection.equalsIgnoreCase("desc") && !sortDirection.equalsIgnoreCase("asc"))
            log.warn("Unknown sorting direction '" + sortDirection + "'. Assuming ascending order. " +
                    "Please use 'asc' or 'desc' to specify the order of the search results");

        //TODO: Add sorting direction and property to sort by
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Room> searchResult = roomRepository.findAll(pageable);

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
        return new SearchPreviewDTO(room.getRoomID(),
                room.getName(),
                room.getRating(),
                room.getReviewCount(),
                room.getNumOfBeds(),
                100,
                "Private Room",
                room.getThumbnail().getImageGuid());
    }
}