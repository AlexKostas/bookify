package com.bookify.user;

import com.bookify.user.ProfilePictureService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@AllArgsConstructor
public class ProfilePictureController {

    private final ProfilePictureService profilePictureService;

    @PostMapping("/uploadProfilePic/{username}")
    @PreAuthorize("hasRole('admin') or #username == authentication.name")
    public ResponseEntity uploadProfilePic(@PathVariable String username, @RequestParam("file")MultipartFile image) {
        try {
            //TODO: maybe return CREATED http status instead
            return ResponseEntity.ok(profilePictureService.uploadProfilePicture(username, image));
        } catch (IllegalArgumentException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getProfilePic/{username}")
    public ResponseEntity getProfilePic(@PathVariable String username){
        try{
            //TODO: extend for other image types
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);

            return ResponseEntity.ok().headers(headers).body(profilePictureService.getProfilePicture(username));
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteProfilePic/{username}")
    @PreAuthorize("hasRole('admin') or #username == authentication.name")
    public ResponseEntity deleteProfilePic(@PathVariable String username){
        try {
            return ResponseEntity.ok(profilePictureService.deleteProfilePicture(username));
        }
        catch (UnsupportedOperationException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.METHOD_NOT_ALLOWED);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}