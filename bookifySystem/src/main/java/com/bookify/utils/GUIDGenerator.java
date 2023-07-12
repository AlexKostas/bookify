package com.bookify.utils;

import java.util.UUID;

public class GUIDGenerator {
    public static String GenerateGUID(){
        return UUID.randomUUID().toString();
    }
}
