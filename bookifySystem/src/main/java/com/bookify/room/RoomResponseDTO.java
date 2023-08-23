package com.bookify.room;

import java.time.LocalDate;
import java.util.List;

public record RoomResponseDTO (
        String hostUsername,        String name,         String summary,                String description,
        String notes,               String address,      String neighborhood,           String neighborhoodOverview,
        String transitInfo,         String city,         String state,                  String country,                 String zipcode,
        String latitude,            String longitude,    int minimumStay,               String rules,
        int nBeds,                  int nBaths,          int nBedrooms,                 int surfaceArea,                int accommodates,
        String roomType,            float pricePerNight, int maxTenants,                float extraCostPerTenant,       int roomTypeID,
        List<String> amenityNames,  List<String> amenityDescriptions,                   List<Integer> amenityIDs,
        String thumbnailGuid,       List<String> photosGUIDs,                           float rating,                   int reviewCount,

        List<LocalDate> bookedDays, List<DatePairDTO> bookedRanges
) {}