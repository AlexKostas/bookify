package com.bookify.room;

import com.bookify.user.User;
import com.bookify.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class RoomAuthenticationUtility {

    private final UserRepository userRepository;

    public void verifyRoomEditingPrivileges(Room room) throws IllegalAccessException {
        User currentUser = userRepository.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()).get();

        Long hostID = room.getRoomHost().getUserID();
        if(hostID != currentUser.getUserID() && !currentUser.isAdmin())
            throw new IllegalAccessException("Insufficient privileges to edit/delete room " + room.getRoomID());
    }
}
