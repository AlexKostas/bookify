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

    // Unfortunately, due to the way JPA works it is not allowed to use named parameters in the order by clause
    // and although it works, it is non-standard, throws exceptions and could break at any moment. Since there is
    // no way to conveniently parameterize the order direction, two separate queries are needed. BE CAREFUL TO MAKE ANY
    // CHANGES TO BOTH OF THE QUERIES SO THEY CONTINUE TO PRODUCE THE SAME RESULT.

    @Query("SELECT r FROM Room r " +
            "LEFT JOIN r.amenities a " +
            "WHERE ((:filterAmenityCount = 0 OR a IN :filterAmenities) OR a IS NULL) " +
            "AND (r.roomType IN :roomTypeFilter OR :roomTypeFilterCount = 0) " +
            "AND :nights >= r.minimumStay " +
            "AND r.city = :city AND r.state = :state AND r.country = :country " +
            "AND (r.pricePerNight + r.extraCostPerTenant * GREATEST(0, :tenants - r.maxTenants)) * :nights <= :maxPrice " +
            "AND r IN ( " +
            "   SELECT a.room FROM Availability a " +
            "   WHERE a.date >= :startDate AND a.date < :endDate " +
            "   GROUP BY a.room " +
            "   HAVING COUNT(a) = :nights" +
            ") " +
            "GROUP BY r " +
            "HAVING COUNT(a) = :filterAmenityCount OR :filterAmenityCount = 0 " +
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
            String city,
            String state,
            String country,
            Pageable pageable
    );

    @Query("SELECT r FROM Room r " +
            "LEFT JOIN r.amenities a " +
            "WHERE ((:filterAmenityCount = 0 OR a IN :filterAmenities) OR a IS NULL) " +
            "AND (r.roomType IN :roomTypeFilter OR :roomTypeFilterCount = 0) " +
            "AND :nights >= r.minimumStay " +
            "AND r.city = :city AND r.state = :state AND r.country = :country " +
            "AND (r.pricePerNight + r.extraCostPerTenant * GREATEST(0, :tenants - r.maxTenants)) * :nights <= :maxPrice " +
            "AND r IN ( " +
            "   SELECT a.room FROM Availability a " +
            "   WHERE a.date >= :startDate AND a.date < :endDate " +
            "   GROUP BY a.room " +
            "   HAVING COUNT(a) = :nights" +
            ") " +
            "GROUP BY r " +
            "HAVING COUNT(a) = :filterAmenityCount OR :filterAmenityCount = 0 " +
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
            String city,
            String state,
            String country,
            Pageable pageable
    );

    Page<Room> findByRoomHost_Username(String hostUsername, Pageable pageable);

    // Running native query, so we are able to use LIMIT keyword. We do not want the autocomplete to return the entire
    // room table
    @Query(nativeQuery = true, value =
            "SELECT DISTINCT r.city, r.state, r.country FROM rooms r " +
            "WHERE LOWER(r.city) LIKE CONCAT('%', LOWER(:input), '%') " +
            "   OR LOWER(r.state) LIKE CONCAT('%', LOWER(:input), '%') " +
            "   OR LOWER(r.country) LIKE CONCAT('%', LOWER(:input), '%') " +
            "LIMIT " + Configuration.MAX_LOCATION_AUTOCOMPLETE_SUGGESTIONS)
    List<String[]> findAutocompleteLocationSuggestions(@Param("input") String input);
}