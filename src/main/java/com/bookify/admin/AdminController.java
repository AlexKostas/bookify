package com.bookify.admin;

import com.bookify.user.UserRepository;
import com.bookify.user.UserService;
import jdk.jshell.spi.ExecutionControl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
@AllArgsConstructor
public class AdminController {

    private AdminService adminService;
    private UserService userService;

    @GetMapping("/getAllUsers")
    public List<UserResponseDTOForAdmin> getAllUsers(){
        return adminService.getAllUsers();
    }

    @DeleteMapping("/deleteUser/{username}")
    public ResponseEntity deleteUser(@PathVariable String username){
        //TODO: error handling
        userService.deleteUser(username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/approveHost/{username}")
    public ResponseEntity approveHost(@PathVariable String username){
        //TODO: error handling
        adminService.approveHost(username);
        return ResponseEntity.ok().build();
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

