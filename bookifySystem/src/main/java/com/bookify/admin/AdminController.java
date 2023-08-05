package com.bookify.admin;

import com.bookify.configuration.Configuration;
import com.bookify.user.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private AdminService adminService;
    private UserService userService;

    @GetMapping("/getAllUsers")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = Configuration.DEFAULT_PAGE_INDEX) int pageNumber,
            @RequestParam(defaultValue = Configuration.DEFAULT_PAGE_SIZE) int pageSize
    ){
        try {
            return ResponseEntity.ok(adminService.getAllUsers(pageNumber, pageSize));
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllInactiveHosts")
    public ResponseEntity<?> getAllInactiveHosts(
            @RequestParam(defaultValue = Configuration.DEFAULT_PAGE_INDEX) int pageNumber,
            @RequestParam(defaultValue = Configuration.DEFAULT_PAGE_SIZE) int pageSize
    ){
        try {
            return ResponseEntity.ok(adminService.getAllInactiveHosts(pageNumber, pageSize));
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteUser/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username){
        try{
            userService.deleteUser(username);
            return ResponseEntity.ok().build();
        }
        catch (UsernameNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (UnsupportedOperationException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.METHOD_NOT_ALLOWED);
        }
        catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/approveHost/{username}")
    public ResponseEntity<?> approveHost(@PathVariable String username){
        try{
            adminService.approveHost(username);
            return ResponseEntity.ok().build();
        }
        catch (UsernameNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (UnsupportedOperationException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.METHOD_NOT_ALLOWED);
        }
        catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    //TODO: Add rejectHost endpoint

    @GetMapping("/getUsersXML")
    public String getUserFileXML() throws Exception {
        //TODO: implement this
        //TODO: delete exception
        throw new Exception("Method not yet implemented");
    }

    @GetMapping("/getUsersJSON")
    public String getUserFileJSON() throws Exception {
        //TODO: implement this
        //TODO: delete exception
        throw new Exception("Method not yet implemented");
    }

    @GetMapping("/getRoomsXML")
    public String getRoomsFileXML() throws Exception {
        //TODO: implement this
        //TODO: delete exception
        throw new Exception("Method not yet implemented");
    }

    @GetMapping("/getRoomsJSONL")
    public String getRoomsFileJSON() throws Exception {
        //TODO: implement this
        //TODO: delete exception
        throw new Exception("Method not yet implemented");
    }
}

