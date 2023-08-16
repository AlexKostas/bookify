package com.bookify.room;

import com.bookify.configuration.Configuration;
import com.bookify.room_amenities.Amenity;
import com.bookify.room_type.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    Page<Room> findAll(Pageable pageable);

    @Query("SELECT r FROM Room r " +
            "LEFT JOIN r.amenities a " +
            "WHERE a IN :filterAmenities OR a IS NULL " +
            "AND (r.roomType IN :roomTypeFilter OR :roomTypeFilterCount = 0) " +
            "AND :nights >= r.minimumStay " +
            "AND (r.pricePerNight + r.extraCostPerTenant * GREATEST(0, :tenants - r.maxTenants)) * :nights <= :maxPrice " +
            "AND r IN ( " +
            "   SELECT a.room FROM Availability a " +
            "   WHERE a.date >= :startDate AND a.date < :endDate " +
            "   GROUP BY a.room " +
            "   HAVING COUNT(a) = :nights" +
            ") " +
            "GROUP BY r " +
            "HAVING COUNT(a) = :filterAmenityCount " +
            "ORDER BY " +
            "(r.pricePerNight + r.extraCostPerTenant * GREATEST(0, :tenants - r.maxTenants)) * :nights ASC")
    Page<Room> filterRoomsASC(
            Set<Amenity> filterAmenities,
            Integer filterAmenityCount,
            LocalDate startDate,
            LocalDate endDate,
            long nights,
            Set<RoomType> roomTypeFilter,
            Integer roomTypeFilterCount,
            float maxPrice,
            int tenants,
            Pageable pageable
    );

    @Query("SELECT r FROM Room r " +
            "LEFT JOIN r.amenities a " +
            "WHERE a IN :filterAmenities OR a IS NULL " +
            "AND (r.roomType IN :roomTypeFilter OR :roomTypeFilterCount = 0) " +
            "AND :nights >= r.minimumStay " +
            "AND (r.pricePerNight + r.extraCostPerTenant * GREATEST(0, :tenants - r.maxTenants)) * :nights <= :maxPrice " +
            "AND r IN ( " +
            "   SELECT a.room FROM Availability a " +
            "   WHERE a.date >= :startDate AND a.date < :endDate " +
            "   GROUP BY a.room " +
            "   HAVING COUNT(a) = :nights" +
            ") " +
            "GROUP BY r " +
            "HAVING COUNT(a) = :filterAmenityCount " +
            "ORDER BY " +
            "(r.pricePerNight + r.extraCostPerTenant * GREATEST(0, :tenants - r.maxTenants)) * :nights DESC")
    Page<Room> filterRoomsDESC(
            Set<Amenity> filterAmenities,
            Integer filterAmenityCount,
            LocalDate startDate,
            LocalDate endDate,
            long nights,
            Set<RoomType> roomTypeFilter,
            Integer roomTypeFilterCount,
            float maxPrice,
            int tenants,
            Pageable pageable
    );

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