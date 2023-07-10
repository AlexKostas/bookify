package com.bookify.user;

public record ChangePasswordDTO(String username, String oldPassword, String newPassword) {}
