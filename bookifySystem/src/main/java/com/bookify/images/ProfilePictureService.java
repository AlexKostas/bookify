package com.bookify.images;

import com.bookify.configuration.Configuration;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class ProfilePictureService {

    private final ImageRepository imageRepository;
    private final ResourceLoader resourceLoader;
    private final String pathRoot;

    public ProfilePictureService(ImageRepository imageRepository, ResourceLoader resourceLoader) throws IOException {
        this.imageRepository = imageRepository;
        this.resourceLoader = resourceLoader;

        pathRoot = getImageDirectoryPath();
    }

    public String uploadProfilePicture(String username, MultipartFile image) throws IOException, IllegalArgumentException {
        // We assume the user already exists in the repository since they passed authentication tests to reach
        // this point

        if(image.isEmpty()) throw new IllegalArgumentException("The provided file is empty");

        String guid = "";
        do{
            guid = GUIDGenerator.GenerateGUID();
        } while(imageRepository.findByImageGuid(guid).isPresent());

        //TODO: support other image types
        String finalPath = pathRoot +  guid + ".png";
        File newFile = new File(finalPath);
        image.transferTo(newFile);

        imageRepository.save(new Image(guid));
        //TODO: handle relation with user
        //TODO: delete previous profile picture

        return guid;
    }

    private String getImageDirectoryPath() throws IOException {
        String directoryPath = resourceLoader.getResource("classpath:").getFile().getAbsolutePath() +
                Configuration.IMAGES_SUBFOLDER;

        Path path = Path.of(directoryPath);
        if(!Files.exists(path))
            Files.createDirectories(path);

        return directoryPath + "/";
    }
}
