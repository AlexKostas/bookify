package com.bookify.utils;

import com.bookify.configuration.Configuration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Map;

@Component
@Slf4j
public class IOUtility {

    private final Environment env;
    private final String dataDirectoryPath;

    public IOUtility(Environment env) throws IOException {
        this.env = env;
        dataDirectoryPath = getDirectoryPath(Configuration.DATA_SUBFOLDER);
    }

    public String getDirectoryPath(String subfolder) throws IOException {
        String directoryPath = env.getProperty("upload.directory.root") + subfolder;

        Path path = Path.of(directoryPath);
        if(!Files.exists(path))
            Files.createDirectories(path);

        return directoryPath + "/";
    }

    public void saveRecommendationResults(Map<Long, Integer> userDictionary, Map<Integer, Integer> roomDictionary
            , double[][] userMatrix, double[][] roomMatrix){
        log.info("-- Saving Recommendation Algorithm Results to disk --");

        writeToDisk(userDictionary, dataDirectoryPath + Constants.userDictionaryFilename);
        writeToDisk(roomDictionary, dataDirectoryPath + Constants.roomDictionaryFilename);
        writeToDisk(userMatrix, dataDirectoryPath + Constants.userMatrixFilename);
        writeToDisk(roomMatrix, dataDirectoryPath + Constants.roomMatrixFilename);
    }

    public Map<Long, Integer> readUserDictionaryFromDisk() throws IOException, ClassNotFoundException {
        return (Map<Long, Integer>) readObjectFromDisk(dataDirectoryPath + Constants.userDictionaryFilename);
    }

    public double[][] readUserMatrixFromDisk() throws IOException, ClassNotFoundException {
        return (double[][]) readObjectFromDisk(dataDirectoryPath + Constants.userMatrixFilename);
    }

    public double[][] readRoomMatrixFromDisk() throws IOException, ClassNotFoundException {
        return (double[][]) readObjectFromDisk(dataDirectoryPath + Constants.roomMatrixFilename);
    }

    public boolean recommendationFilesExist(){
        return Files.exists(Path.of(dataDirectoryPath + Constants.userDictionaryFilename));
    }

    private void writeToDisk(Object object, String filepath){
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

    private Object readObjectFromDisk(String filepath) throws IOException, ClassNotFoundException {
        ObjectInputStream stream = new ObjectInputStream(new FileInputStream(filepath));
        Object object = stream.readObject();
        stream.close();

        return object;
    }
}