package com.bookify.room;

import java.util.List;

public record RoomRegistrationDTO(
        String name, String summary, String description, String notes,
        String address, String neighborhood, String neighborhoodOverview,
        String transitInfo, String city, String state, String country, String zipcode,
        String latitude, String longitude,
        int minimumStay, String rules,
        int nBeds, int nBaths, int nBedrooms, int surfaceArea, int accommodates,
        int roomTypeID, float pricePerNight, int maxTenants, float extraCostPerTenant,
        List<Integer> amenityIDs, List<DatePairDTO> availability
){}