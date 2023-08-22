package com.bookify.room;

import com.bookify.configuration.Configuration;
import com.bookify.images.Image;
import com.bookify.images.ImageStorage;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoomPhotoService {

    private final RoomRepository roomRepository;
    private final ImageStorage imageStorage;
    private final RoomAuthenticationUtility roomAuthenticationUtility;

    public String addPhoto(int roomID, MultipartFile photo)
            throws IllegalAccessException, IOException, EntityNotFoundException {
        Room room = roomRepository.findById(roomID).
                orElseThrow(() -> new EntityNotFoundException("Room with id " + roomID + " not found"));

        roomAuthenticationUtility.verifyRoomEditingPrivileges(room);

        Image newPhoto = imageStorage.saveImage(photo);
        room.addPhoto(newPhoto);

        roomRepository.save(room);
        return newPhoto.getImageGuid();
    }

    public String addThumbnail(int roomID, MultipartFile thumbnail)
            throws IllegalAccessException, IOException, EntityNotFoundException {
        Room room = roomRepository.findById(roomID).
                orElseThrow(() -> new EntityNotFoundException("Room with id " + roomID + " not found"));

        roomAuthenticationUtility.verifyRoomEditingPrivileges(room);

        Image oldThumbnail = room.getThumbnail();
        if(oldThumbnail != null && !oldThumbnail.getImageGuid().equals(Configuration.DEFAULT_ROOM_THUMBNAIL_NAME))
            imageStorage.deleteImage(oldThumbnail);

        Image newThumbnail = imageStorage.saveImage(thumbnail);
        room.setThumbnail(newThumbnail);

        roomRepository.save(room);
        return newThumbnail.getImageGuid();
    }

    public List<String> getPhotoGUIDs(int roomID) throws EntityNotFoundException {
        Room room = roomRepository.findById(roomID).
                orElseThrow(() -> new EntityNotFoundException("Room with id " + roomID + " not found"));

        // Create list with the GUIDs of all the photos in the room
        return room.getPhotos().stream().map(Image::getImageGuid).collect(Collectors.toList());
    }

    public FileSystemResource getPhoto(String guid) throws EntityNotFoundException {
        return imageStorage.loadImageFileByGuid(guid);
    }

    public void deletePhoto(String guid, Integer roomID) throws EntityNotFoundException, IllegalAccessException {
        Room room = roomRepository.findById(roomID).
                orElseThrow(() -> new EntityNotFoundException("Room with id " + roomID + " not found"));

        Image photoToDelete = imageStorage.loadImage(guid);

        if(!room.containsPhoto(photoToDelete))
            throw new EntityNotFoundException("Room " + roomID + " does not contain photo with guid " +
                    photoToDelete.getImageGuid());

        roomAuthenticationUtility.verifyRoomEditingPrivileges(room);

        imageStorage.deleteImage(photoToDelete);
        room.deletePhoto(photoToDelete);

        roomRepository.save(room);
    }
}
