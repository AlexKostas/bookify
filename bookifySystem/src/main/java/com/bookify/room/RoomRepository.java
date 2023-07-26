package com.bookify.room;

import com.bookify.configuration.Configuration;
import com.bookify.room_amenities.Amenity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    Page<Room> findAll(Pageable pageable);

    @Query("SELECT r FROM Room r " +
            "JOIN r.amenities a " +
            "WHERE a IN :amenities " +
            "GROUP BY r " +
            "HAVING COUNT(a) = :amenitiesCount")
    List<Room> filterRoomsByAmenities(@Param("amenities") Set<Amenity> amenities,
                                       @Param("amenitiesCount") Integer amenitiesCount);

    @Query("SELECT r.roomID FROM Room r WHERE r.roomHost.username = :hostUsername")
    List<String> findRoomIDsByHostUsername(@Param("hostUsername") String hostUsername);

    // Running native query, so we are able to use LIMIT keyword
    @Query(nativeQuery = true, value =
            "SELECT DISTINCT r.city, r.state, r.country FROM rooms r " +
            "WHERE LOWER(r.city) LIKE CONCAT('%', LOWER(:input), '%') " +
            "   OR LOWER(r.state) LIKE CONCAT('%', LOWER(:input), '%') " +
            "   OR LOWER(r.country) LIKE CONCAT('%', LOWER(:input), '%') " +
            "LIMIT " + Configuration.MAX_LOCATION_AUTOCOMPLETE_SUGGESTIONS)
    List<String[]> findAutocompleteLocationSuggestions(@Param("input") String input);
}