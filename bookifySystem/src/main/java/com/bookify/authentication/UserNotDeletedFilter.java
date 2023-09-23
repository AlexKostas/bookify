package com.bookify.authentication;

import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.Constants;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.Optional;

// This custom filter ensures that a user trying to authenticate is not deleted. Needs to be placed after any Spring
// Security filters in the Security Filter Chain to work properly.
@Slf4j
@RequiredArgsConstructor
public class UserNotDeletedFilter implements Filter {

    private final UserRepository userRepository;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                         FilterChain chain) throws IOException, ServletException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // If the user is an anonymousPrincipal, i.e. not authenticated, we don't do anything and proceed to
        // the next filter. We don't want to completely reject requests from unauthenticated users
        if(authentication.getName().equals(Constants.ANONYMOUS_USER_PRINCIPAL)) {
            chain.doFilter(req, res);
            return;
        }

        // Retrieve user object corresponding to authentication name from the database
        Optional<User> userOptional = userRepository.findByUsername(authentication.getName());

        // If user is not found, it means that either they don't exist or have been deleted, therefore we are rejecting
        // this request, sending an appropriate HTTP error response.
        if (userOptional.isEmpty()) {
            log.info("User not found for username: " + authentication.getName());
            ((HttpServletResponse) res).sendError(HttpServletResponse.SC_UNAUTHORIZED, "The JWT is invalid");

            return;
        }

        // If the user exists, continue with the filter chain
        chain.doFilter(req, res);
    }
}