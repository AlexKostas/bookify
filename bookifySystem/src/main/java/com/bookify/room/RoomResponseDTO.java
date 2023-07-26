package com.bookify.room;

import java.util.List;

public record RoomResponseDTO (int nBeds, int nBaths, int nBedrooms, int surfaceArea, String description,
                              List<String> amenityNames, List<String> amenityDescriptions, String thumbnailGuid) {}
