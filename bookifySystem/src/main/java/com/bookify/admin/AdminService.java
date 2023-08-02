package com.bookify.admin;

import com.bookify.role.Role;
import com.bookify.role.RoleRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class AdminService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;

    public List<UserResponseDTOForAdmin> getAllUsers(){
        List<User> users = userRepository.findAll();
        List<UserResponseDTOForAdmin> result = new ArrayList<>();

        for(User user : users){
            if(user.isAdmin()) continue;

            result.add(new UserResponseDTOForAdmin(
                    user.getUsername(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getRolePreference()
            ));
        }

        return result;
    }

    public void approveHost(String username) throws UsernameNotFoundException, UnsupportedOperationException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));

        if(user.isAdmin()) throw new UnsupportedOperationException("Can not approve an admin user");
        if(!user.isInactiveHost()) throw new UnsupportedOperationException("Can not approve an already active host or" +
                "a tenant");

        Role hostRole = roleRepository.findByAuthority("host").get();
        user.activateHost(hostRole);
        userRepository.save(user);
    }
}
