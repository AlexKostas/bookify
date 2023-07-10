package com.bookify.user;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    @GetMapping("/getUser/{username}")
    public ResponseEntity getUser(@PathVariable String username){
        //TODO: restrict access to admin or appropriate user

        try{
            return ResponseEntity.ok(userService.loadUserData(username));
        }
        catch (UsernameNotFoundException e){
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/updateProfile")
    public ResponseEntity updateProfile(@RequestBody UpdateUserProfileDTO updateUserProfileDTO){
        //TODO: restrict access

        try {
            userService.updateUser(updateUserProfileDTO);
            return ResponseEntity.ok().build();
        }
        catch (UsernameNotFoundException e){
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (IllegalArgumentException e){
            return new ResponseEntity(e.getMessage(), HttpStatus.CONFLICT);
        }
        catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    //TODO: Change password endpoint
}
