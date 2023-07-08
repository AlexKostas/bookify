package com.bookify.room;

import com.bookify.user.User;

public record RoomDTO (int nBeds, int nBaths, int nBedrooms, boolean livingRoom,
                       int sArea, String descr, String rCategory,
                       String addr, User rHost) {}