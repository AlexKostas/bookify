package com.bookify.user;

public record UpdateUserProfileDTO(String username, String firstName, String lastName, String email, String phoneNumber) {}