package com.bookify.admin;

import com.bookify.images.Image;
import com.bookify.role.Role;
import com.bookify.user.User;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record HostDTO(
        Long userID,        String username,        String firstName,
        String lastName,    String email,           String phoneNumber,
        String aboutInfo,   Image profilePicture,   Set<Role> roles,
        List<RoomDTOJson> rooms
) {
    public HostDTO(User host) {
        this(
                host.getUserID(),
                host.getUsername(),
                host.getFirstName(),
                host.getLastName(),
                host.getEmail(),
                host.getPhoneNumber(),
                host.getAboutInfo(),
                host.getProfilePicture(),
                host.getRoles(),
                host.getRooms().stream()
                        .map(RoomDTOJson::new)
                        .collect(Collectors.toList())
        );
    }
}
