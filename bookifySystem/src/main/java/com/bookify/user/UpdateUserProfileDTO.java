package com.bookify.user;

public record UpdateUserProfileDTO(String oldUsername,String newUsername, String firstName, String lastName,
                                   String email, String phoneNumber) {}