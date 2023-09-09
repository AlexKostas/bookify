package com.bookify.search;

import com.bookify.configuration.Configuration;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/search")
@AllArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @PutMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(defaultValue = Configuration.DEFAULT_PAGE_INDEX) int pageNumber,
            @RequestParam(defaultValue = Configuration.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = Configuration.DEFAULT_SEARCH_ORDER) String orderDirection,
            @RequestBody SearchRequestDTO searchRequestDTO
    ){
        try {
            Page<SearchPreviewDTO> searchResults = searchService.search(
                    pageNumber,
                    pageSize,
                    orderDirection,
                    searchRequestDTO
            );
            return ResponseEntity.ok(searchResults);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<?> autocomplete(@RequestParam String input) {
        try {
            List<String> suggestions = searchService.getAutocompleteLocationSuggestions(input);
            return ResponseEntity.ok(suggestions);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}