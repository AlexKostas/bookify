package com.bookify.registration;

import java.util.List;

public record LoginRegistrationResponseDTO(String username, String accessToken,
                                           String refreshToken, List<String> roles) {}
