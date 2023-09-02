package com.bookify.room;

import com.bookify.images.ImageResourceDTO;
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
    @PreAuthorize("hasRole('host')")
    public ResponseEntity<?> addPhoto(@PathVariable Integer roomID, @RequestParam("file") MultipartFile photo){
        try{
            String newPhotoGuid = roomPhotoService.addPhoto(roomID, photo);
            return ResponseEntity.status(HttpStatus.CREATED).body(newPhotoGuid);
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

    @PostMapping("/addThumbnail/{roomID}")
    @PreAuthorize("hasRole('host')")
    public ResponseEntity<?> addThumbnail(@PathVariable Integer roomID, @RequestParam("file") MultipartFile thumbnail){
        try{
            String newThumbnailGuid = roomPhotoService.addThumbnail(roomID, thumbnail);
            return ResponseEntity.status(HttpStatus.CREATED).body(newThumbnailGuid);
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
            ImageResourceDTO imageResource = roomPhotoService.getPhoto(guid);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(imageResource.mediaType());

            return ResponseEntity.ok().headers(headers).body(imageResource.resource());
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{guid}/{roomID}")
    @PreAuthorize("hasRole('host')")
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