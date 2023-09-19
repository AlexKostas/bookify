package com.bookify.user;

import com.bookify.configuration.Configuration;
import com.bookify.images.Image;
import com.bookify.images.ImageResourceDTO;
import com.bookify.images.ImageStorage;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@AllArgsConstructor
public class ProfilePictureService {

    private final UserRepository userRepository;
    private final ImageStorage imageStorage;

    public String uploadProfilePicture(String username, MultipartFile image) throws IOException, IllegalArgumentException {
        // We assume the user already exists in the repository since they passed authentication tests to reach
        // this point
        User user = userRepository.findByUsername(username).get();
        Image imageItem = imageStorage.saveImage(image);

        try{
            imageStorage.deleteImage(user.getProfilePicture());
        }
        catch (UnsupportedOperationException ignored){}

        user.setProfilePicture(imageItem);
        userRepository.save(user);

        return imageItem.getImageGuid();
    }

    public ImageResourceDTO getProfilePicture(String username){
        User user = userRepository.findByUsername(username).
                orElseThrow(() -> new EntityNotFoundException("Could not find user " + username));
        return imageStorage.loadImageFile(user.getProfilePicture());
    }

    public String deleteProfilePicture(String username) throws UnsupportedOperationException {
        User user = userRepository.findByUsername(username).get();
        Image oldProfilePic = user.getProfilePicture();

        imageStorage.deleteImage(oldProfilePic);
        Image defaultPic = imageStorage.loadImage(Configuration.DEFAULT_PROFILE_PIC_NAME);

        user.setProfilePicture(defaultPic);
        userRepository.save(user);

        return defaultPic.getImageGuid();
    }
}