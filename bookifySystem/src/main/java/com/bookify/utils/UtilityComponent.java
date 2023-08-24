package com.bookify.utils;

import com.bookify.user.User;
import com.bookify.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class UtilityComponent {

    private final UserRepository userRepository;

    // Assumes it is only called when the user is actually authenticated
    public User getCurrentAuthenticatedUser() throws EntityNotFoundException {
        return userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new EntityNotFoundException("Current authenticated user not found"));
    }

    public User getCurrentAuthenticatedUserIfExists() {
        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals(Constants.ANONYMOUS_USER_PRINCIPAL))
            return null;

        return userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName()).get();
    }
}