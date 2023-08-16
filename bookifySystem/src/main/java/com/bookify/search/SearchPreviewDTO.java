package com.bookify.search;

//TODO: add thumbnail guid, cost per day, room type
public record SearchPreviewDTO(int roomID, String name, float rating, int reviewCount,
                               int bedCount, float price, String roomType, String thumbnail) {}