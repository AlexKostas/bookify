package com.bookify.registration;

import com.bookify.user.User;

//TODO: do not return the whole user
public record LoginResponseDTO (User user, String jwtToken) {}
