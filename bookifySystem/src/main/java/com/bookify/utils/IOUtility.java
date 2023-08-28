package com.bookify.utils;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;

@Component
@AllArgsConstructor
@Slf4j
public class IOUtility {

    private final Environment env;

    public void writeToDisk(Object object, String filepath){
        try {
            ObjectOutputStream userDictStream = new ObjectOutputStream(new FileOutputStream(filepath));
            userDictStream.writeObject(object);
            userDictStream.close();
            log.info("Successfully wrote object to " + filepath);
        } catch (IOException e) {
            log.error("Could not save object to: " + filepath + ". Reason: ");
            System.out.println(Arrays.toString(e.getStackTrace()));
        }
    }

    public String getDirectoryPath(String subfolder) throws IOException {
        String directoryPath = env.getProperty("upload.directory.root") + subfolder;

        Path path = Path.of(directoryPath);
        if(!Files.exists(path))
            Files.createDirectories(path);

        return directoryPath + "/";
    }
}
