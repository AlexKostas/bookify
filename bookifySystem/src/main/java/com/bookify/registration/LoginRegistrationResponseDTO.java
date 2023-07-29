package com.bookify.registration;

import java.util.List;

public record LoginRegistrationResponseDTO(String username, String jwtToken, List<String> roles) {}
