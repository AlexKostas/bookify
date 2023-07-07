package com.bookify.admin;

import com.bookify.user.User;
import com.bookify.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class AdminService {

    private UserRepository userRepository;

    public List<UserResponseDTOForAdmin> getAllUsers(){
        List<User> users = userRepository.findAll();
        List<UserResponseDTOForAdmin> result = new ArrayList<>();

        for(User user : users){
            if(user.isAdmin()) continue;

            result.add(new UserResponseDTOForAdmin(
                    user.getUsername(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRolesAsString()
            ));
        }

        return result;
    }
}
