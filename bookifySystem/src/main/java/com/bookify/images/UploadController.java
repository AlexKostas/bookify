package com.bookify.images;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/upload")
@AllArgsConstructor
public class UploadController {

    private final ProfilePictureService profilePictureService;

    @PostMapping("/uploadProfilePic/{username}")
    @PreAuthorize("hasRole('admin') or #username == authentication.name")
    public ResponseEntity uploadProfilePic(@PathVariable String username, @RequestParam("file")MultipartFile image) {
        try {
            return ResponseEntity.ok(profilePictureService.uploadProfilePicture(username, image));
        } catch (IllegalArgumentException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @GetMapping("/getProfilePic/{username}")
//    @PreAuthorize("hasRole('admin') or #username == authentication.name")
//    public ResponseEntity getProfilePic(@PathVariable String username){
//
//    }
//
//    @DeleteMapping("/deleteProfilePic/{username}")
//    @PreAuthorize("hasRole('admin') or #username == authentication.name")
//    public ResponseEntity deleteProfilePic(@PathVariable String username){
//
//    }
}
