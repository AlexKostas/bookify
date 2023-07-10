package com.bookify.user;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    @GetMapping("/getUser")
    public UserResponseDTO getUser(@RequestParam(name = "name") String username){
        //TODO: return appropriate response when usernameOrEmail not exists
        //TODO: restrict access to admin or appropriate user
        return userService.loadUserData(username);
    }

    @PostMapping("/updateProfile")
    public ResponseEntity updateProfile(@RequestBody UpdateUserProfileDTO updateUserProfileDTO){
        //TODO: handle errors with usernameOrEmail
        //TODO: restrict access
        userService.updateUser(updateUserProfileDTO);

        return ResponseEntity.ok().build();
    }
}
