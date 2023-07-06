package com.bookify.registration;

public record RegistrationDTO(String username, String firstName, String lastName,
                              String email, String password, String phoneNumber) {}
