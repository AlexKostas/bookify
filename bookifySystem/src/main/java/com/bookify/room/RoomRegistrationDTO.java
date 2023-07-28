package com.bookify.room;

import java.util.List;

public record RoomRegistrationDTO(int nBeds, int nBaths, int nBedrooms, int surfaceArea, String description,
                                  List<Integer> amenityIDs) {}