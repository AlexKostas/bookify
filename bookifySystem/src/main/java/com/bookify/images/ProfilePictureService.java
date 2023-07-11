package com.bookify.images;

import com.bookify.configuration.Configuration;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class ProfilePictureService {

    private static final Logger logger = LoggerFactory.getLogger(ProfilePictureService.class);

    private final ImageRepository imageRepository;
    private final UserRepository userRepository;
    private final ResourceLoader resourceLoader;
    private final String pathRoot;

    public ProfilePictureService(ImageRepository imageRepository, UserRepository userRepository,
                                 ResourceLoader resourceLoader) throws IOException {
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
        this.resourceLoader = resourceLoader;

        pathRoot = getImageDirectoryPath();
    }

    public String uploadProfilePicture(String username, MultipartFile image) throws IOException, IllegalArgumentException {
        // We assume the user already exists in the repository since they passed authentication tests to reach
        // this point
        User user = userRepository.findByUsername(username).get();

        if(image.isEmpty()) throw new IllegalArgumentException("The provided file is empty");

        String guid = "";
        do{
            guid = GUIDGenerator.GenerateGUID();
        } while(imageRepository.findByImageGuid(guid).isPresent() || guid.equals(Configuration.DEFAULT_PROFILE_PIC_NAME));


        Image imageItem = imageRepository.save(new Image(guid));
        try{
            String finalPath = pathRoot +  imageItem.getImageFilename();
            File newFile = new File(finalPath);
            image.transferTo(newFile);
        }
        catch (IOException e){
            imageRepository.delete(imageItem);
            throw e;
        }

        deleteImage(user.getProfilePicture());
        user.setProfilePicture(imageItem);
        userRepository.save(user);

        return guid;
    }

    public FileSystemResource getProfilePicture(String username){
        User user = userRepository.findByUsername(username).get();
        String filename = user.getProfilePicture().getImageFilename();
        String finalPath = pathRoot + filename;

        return new FileSystemResource(finalPath);
    }

    private String getImageDirectoryPath() throws IOException {
        String directoryPath = resourceLoader.getResource("classpath:").getFile().getAbsolutePath() +
                Configuration.IMAGES_SUBFOLDER;

        Path path = Path.of(directoryPath);
        if(!Files.exists(path))
            Files.createDirectories(path);

        return directoryPath + "/";
    }

    private void deleteImage(Image image){
        String guid = image.getImageGuid();
        if(guid.equals(Configuration.DEFAULT_PROFILE_PIC_NAME)) return;

        deleteImageFile(image.getImageFilename());
        imageRepository.delete(image);
    }

    private void deleteImageFile(String filename){
        assert(!filename.equals(Configuration.DEFAULT_PROFILE_PIC_NAME));

        String imagePath = pathRoot + filename;
        try {
            Files.delete(Path.of(imagePath));
        } catch (IOException e) {
            logger.error("Could not delete file {}", imagePath);
        }
    }
}
