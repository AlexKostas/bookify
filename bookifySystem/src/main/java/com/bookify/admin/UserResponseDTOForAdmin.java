package com.bookify.admin;

import java.util.List;

public record UserResponseDTOForAdmin(Long id, String username, String firstName, String lastName, List<String> roles) {}
