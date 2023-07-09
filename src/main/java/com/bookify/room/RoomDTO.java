package com.bookify.room;

import com.bookify.user.User;

public record RoomDTO (int nBeds, int nBaths, int nBedrooms,
                       int sArea, String descr) {}