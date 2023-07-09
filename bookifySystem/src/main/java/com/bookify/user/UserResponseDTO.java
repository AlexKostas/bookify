package com.bookify.user;

public record UserResponseDTO (String username, String firstName, String lastName, String email, String phoneNumber,
                               String roles) {}

