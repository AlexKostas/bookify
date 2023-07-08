package com.bookify.room;

public record RoomDTO (int nBeds, int nBaths, String rCategory, int nBedrooms, String password,
                       boolean livingRoom, int spaceArea, String description) {}