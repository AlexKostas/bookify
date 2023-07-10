package com.bookify.user;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.naming.OperationNotSupportedException;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    @GetMapping("/getUser/{username}")
    @PreAuthorize("hasRole('admin') or #username == authentication.name")
    public ResponseEntity getUser(@PathVariable String username){
        try{
            return ResponseEntity.ok(userService.loadUserData(username));
        }
        catch (UsernameNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/updateProfile")
    @PreAuthorize("hasRole('admin') or #updateUserProfileDTO.oldUsername() == authentication.name")
    public ResponseEntity<String> updateProfile(@RequestBody UpdateUserProfileDTO updateUserProfileDTO){
        try {
            String token = userService.updateUser(updateUserProfileDTO);
            return ResponseEntity.ok(token);
        }
        catch (UsernameNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (IllegalArgumentException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
        catch (OperationNotSupportedException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    //TODO: Change password endpoint
}
