package com.bookify.images;

import com.bookify.configuration.Configuration;
import com.bookify.utils.GUIDGenerator;
import com.bookify.utils.ImageFormatDetector;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Component
@Slf4j
public class ImageStorage {
    private final ImageRepository imageRepository;
    private final ResourceLoader resourceLoader;
    private final ImageFormatDetector imageFormatDetector;
    private final String pathRoot;

    public ImageStorage(ImageRepository imageRepository, ResourceLoader resourceLoader,
                        ImageFormatDetector imageFormatDetector) throws IOException {
        this.imageRepository = imageRepository;
        this.resourceLoader = resourceLoader;
        this.imageFormatDetector = imageFormatDetector;

        pathRoot = getImageDirectoryPath();
    }

    public Image saveImage(MultipartFile image) throws IOException {
        if(image.isEmpty()) throw new IllegalArgumentException("The provided file is empty");

        String guid;
        do{
            guid = GUIDGenerator.GenerateGUID();
        } while(imageRepository.findByImageGuid(guid).isPresent() || guid.equals(Configuration.DEFAULT_PROFILE_PIC_NAME));

        String imageFormat = imageFormatDetector.getImageFormat(image);

        Image imageItem = imageRepository.save(new Image(guid, imageFormat));
        try{
            saveImageFile(imageItem.getImageFilename(), image);
        }
        catch (IOException e){
            imageRepository.delete(imageItem);
            throw e;
        }

        return imageItem;
    }

    public Image loadImage(String guid) throws EntityNotFoundException {
        return imageRepository.findByImageGuid(guid).
                orElseThrow(() -> new EntityNotFoundException("Image with id " + guid + " not found"));
    }

    public FileSystemResource loadImageFile(Image image){
        String finalPath = pathRoot + image.getImageFilename();
        return new FileSystemResource(finalPath);
    }

    public FileSystemResource loadImageFileByGuid(String guid) throws EntityNotFoundException {
        Image image = imageRepository.findByImageGuid(guid).
                orElseThrow(() -> new EntityNotFoundException("Image with guid "+ guid + " not found"));
        String finalPath = pathRoot + image.getImageFilename();
        return new FileSystemResource(finalPath);
    }

    public void deleteImages(List<Image> images) throws UnsupportedOperationException {
        for (Image image : images)
            deleteImage(image);
    }

    public void deleteImage(Image image) throws UnsupportedOperationException {
        String guid = image.getImageGuid();
        if(guid.equals(Configuration.DEFAULT_PROFILE_PIC_NAME) || guid.equals(Configuration.DEFAULT_ROOM_THUMBNAIL_NAME))
            throw new UnsupportedOperationException("Can not delete default profile pic");

        deleteImageFile(image.getImageFilename());
        imageRepository.delete(image);
    }

    private void saveImageFile(String filename, MultipartFile image) throws IOException {
        String finalPath = pathRoot +  filename;
        File newFile = new File(finalPath);
        image.transferTo(newFile);
    }

    private void deleteImageFile(String filename){
        assert(!filename.equals(Configuration.DEFAULT_PROFILE_PIC_NAME));

        String imagePath = pathRoot + filename;
        try {
            Files.delete(Path.of(imagePath));
        } catch (IOException e) {
            log.error("Could not delete file {}", imagePath);
        }
    }

    //TODO: refactor into utility class
    private String getImageDirectoryPath() throws IOException {
        String directoryPath = resourceLoader.getResource("classpath:").getFile().getAbsolutePath() +
                Configuration.IMAGES_SUBFOLDER;

        Path path = Path.of(directoryPath);
        if(!Files.exists(path))
            Files.createDirectories(path);

        return directoryPath + "/";
    }
}