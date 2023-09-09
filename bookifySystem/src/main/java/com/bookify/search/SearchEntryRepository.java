package com.bookify.search;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchEntryRepository extends JpaRepository<SearchEntry, Long> {

    @Query("SELECT NEW com.bookify.search.SearchEntryDTO(s.user.userID, r.roomID, COUNT(*)) " +
            "FROM SearchEntry s, Room r " +
            "WHERE s.city = r.city AND s.state = r.state AND s.country = r.country " +
            "GROUP BY s.user.userID, r.roomID ")
    List<SearchEntryDTO> getSearches();
}