package com.bookify.search;

public record SearchPreviewDTO(int roomID, String name, float rating, int reviewCount,
                               int bedCount, float price, String roomType, String thumbnail) {}