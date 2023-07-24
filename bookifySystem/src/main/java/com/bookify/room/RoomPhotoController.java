package com.bookify.room;

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
@RequestMapping("api/roomPhotos")
@AllArgsConstructor
public class RoomPhotoController {

    private final RoomPhotoService roomPhotoService;

    @PostMapping("/addPhoto/{roomID}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addPhoto(@PathVariable Integer roomID, @RequestParam("file") MultipartFile photo){
        try{
            String newPhotoGuid = roomPhotoService.addPhoto(roomID, photo);
            return ResponseEntity.status(HttpStatus.CREATED).body(newPhotoGuid);
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getPhotoGUIDs/{roomID}")
    public ResponseEntity<?> getPhotoGUIDs(@PathVariable Integer roomID){
        try{
            return ResponseEntity.ok(roomPhotoService.getPhotoGUIDs(roomID));
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/{guid}")
    public ResponseEntity<?> getPhoto(@PathVariable String guid){
        try{
            //TODO: extend for other image types
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);

            return ResponseEntity.ok().headers(headers).body(roomPhotoService.getPhoto(guid));
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{guid}/{roomID}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deletePhoto(@PathVariable String guid, @PathVariable Integer roomID){
        try{
            roomPhotoService.deletePhoto(guid, roomID);
            return ResponseEntity.ok().build();
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}