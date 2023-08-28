package com.bookify.recommendation;

import com.bookify.configuration.Configuration;
import com.bookify.reviews.Review;
import com.bookify.reviews.ReviewRepository;
import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.search.SearchPreviewDTO;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.UtilityComponent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ResourceLoader;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
@Slf4j
public class RecommendationService {

    private record RoomRatingPair(double rating, Integer roomID){};

    private final int numberOfRecommendations = 9;

    private final MatrixFactorizer matrixFactorizer;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    private final UtilityComponent utility;
    private final ResourceLoader resourceLoader;


    private List<SearchPreviewDTO> topRatedRooms = new ArrayList<>();

    private final String path;

    public RecommendationService(MatrixFactorizer matrixFactorizer, ReviewRepository reviewRepository,
                                 UserRepository userRepository, RoomRepository roomRepository, UtilityComponent utility,
                                 ResourceLoader resourceLoader) throws IOException {
        this.matrixFactorizer = matrixFactorizer;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.resourceLoader = resourceLoader;
        this.utility = utility;

        path = getDataDirectoryPath();

        updateTopRatedRooms();
        runRecommendationAlgorithm(10);
    }

    public List<SearchPreviewDTO> recommend() {
        User currentUser = utility.getCurrentAuthenticatedUserIfExists();

        if(currentUser == null) return topRatedRooms;

        if(!Files.exists(Path.of(path + "userDict.file"))){
            log.warn("Can not produce recommendations. REASON: the first iteration of the algorithm has not yet been" +
                    " completed. Producing recommendations based on top ratings instead");

            return topRatedRooms;
        }

        Map<Long, Integer> userDictionary;
        double[][] userMatrix;
        double[][] roomMatrix;

        try {
            log.info("-- Reading algorithm results from disk --");

            ObjectInputStream userDictStream = new ObjectInputStream(new FileInputStream(path + "userDict.file"));
            userDictionary = (Map<Long, Integer>) userDictStream.readObject();
            userDictStream.close();

            ObjectInputStream userMatrixStream = new ObjectInputStream(new FileInputStream(path + "userMatrix.file"));
            userMatrix = (double[][]) userMatrixStream.readObject();
            userMatrixStream.close();

            ObjectInputStream roomMatrixStream = new ObjectInputStream(new FileInputStream(path + "roomMatrix.file"));
            roomMatrix = (double[][]) roomMatrixStream.readObject();
            roomMatrixStream.close();

            log.info("-- SUCCESS --");
        } catch (IOException | ClassNotFoundException e) {
            log.error("Could not load results of recommendation algorithm from diskdue to an IO related error. " +
                    "Using top rated rooms instead");
            e.printStackTrace();
            return topRatedRooms;
        }

        List<Integer> roomsIDs = roomRepository.findAllRoomIds();
        int numberOfRooms = roomsIDs.size();

        log.info("--Generating recommendations--");

        if(!userDictionary.containsKey(currentUser.getUserID())){
            log.warn("Can not produce recommendations. REASON: recommendation algorithm has not yet run since " +
                    "user joined. Producing recommendations based on top ratings instead.");
            return topRatedRooms;
        }

        int userRow = userDictionary.get(currentUser.getUserID());

        RoomRatingPair[] ratings = new RoomRatingPair[numberOfRooms];
        for(int i = 0; i < numberOfRooms; i++) {
            double rating = MatrixUtility.dotProduct(userMatrix, roomMatrix, userRow, i);
            ratings[i] = new RoomRatingPair(rating, roomsIDs.get(i));
        }

        Arrays.sort(ratings, (o1, o2) -> Double.compare(o2.rating, o1.rating));

        List<Room> recommendations = new ArrayList<>();
        for(int i = 0; i < numberOfRecommendations; i++)
            recommendations.add(roomRepository.findById(ratings[i].roomID).get());

        return recommendations.stream().map((room)-> utility.mapRoomToDTO(room, 1, 3))
                .toList();
    }

    @Async
    public void updateTopRatedRooms() {
        log.info("---Running background task: Updating top rated rooms---");

        List<Room> rooms = roomRepository.findBestRooms().stream()
                .limit(numberOfRecommendations)
                .toList();

        topRatedRooms = rooms.stream()
                .map(room -> utility.mapRoomToDTO(room, 1, 3))
                .toList();
    }

    public void runRecommendationAlgorithm(int maxIterations){
        log.info("---Running Recommendation Algorithm---");

        log.info("--Loading Users--");
        List<Long> userIDs = userRepository.findAllUserIds();
        log.info("--Loading Rooms--");
        List<Integer> roomsIDs = roomRepository.findAllRoomIds();

        if(userIDs.isEmpty() || roomsIDs.isEmpty()) {
            log.warn("Can not produce recommendations. REASON: users or rooms array is empty");
            return;
        }

        Map<Long, Integer> userDictionary = createUserDictionary(userIDs);
        Map<Integer, Integer> roomDictionary = createRoomDictionary(roomsIDs);

        double[][] ratingMatrix = new double[userIDs.size()][roomsIDs.size()];
        MatrixUtility.zeroOutMatrix(ratingMatrix);

        populateRatingMatrix(ratingMatrix, userDictionary, roomDictionary);

        log.info("--Factorizing Matrix--");
        List<double[][]> result = matrixFactorizer.factorize(ratingMatrix, maxIterations);
        assert(result.size() == 2);

        double[][] userMatrix = result.get(0);
        double[][] roomMatrix = result.get(1);

        saveResults(userDictionary, roomDictionary, userMatrix, roomMatrix);
    }

    private void populateRatingMatrix(double[][] ratingMatrix, Map<Long, Integer> userDictionary,
                                      Map<Integer, Integer> roomDictionary){
        log.info("--Loading Reviews--");
        List<Review> reviews = reviewRepository.findAll();

        log.info("--Creating Rating Matrix--");
        for(Review review : reviews){
            int row = userDictionary.get(review.getReviewer().getUserID());
            int column = roomDictionary.get(review.getRoom().getRoomID());

            ratingMatrix[row][column] = review.getStars();
        }

        //TODO: fill in bookings, rooms opened and searches along with corresponding weights
    }

    private Map<Long, Integer> createUserDictionary(List<Long> userIDs){
        Map<Long, Integer> userDictionary = new HashMap<>();

        for(int i = 0; i < userIDs.size(); i++)
            userDictionary.put(userIDs.get(i), i);

        return userDictionary;
    }

    private Map<Integer, Integer> createRoomDictionary(List<Integer> roomIDs){
        Map<Integer, Integer> roomDictionary = new HashMap<>();

        for(int i = 0; i < roomIDs.size(); i++)
            roomDictionary.put(roomIDs.get(i), i);

        return roomDictionary;
    }

    private void saveResults(Map<Long, Integer> userDictionary, Map<Integer, Integer> roomDictionary
            , double[][] userMatrix, double[][] roomMatrix){
        log.info("-- Saving Recommendation Algorithm Results to disk --");

        try {
            //TODO: refactor this
            ObjectOutputStream userDictStream = new ObjectOutputStream(new FileOutputStream(path + "userDict.file"));
            userDictStream.writeObject(userDictionary);
            userDictStream.close();

            ObjectOutputStream roomDictStream = new ObjectOutputStream(new FileOutputStream(path + "roomDict.file"));
            roomDictStream.writeObject(roomDictionary);
            roomDictStream.close();

            ObjectOutputStream userMatrixStream = new ObjectOutputStream(new FileOutputStream(path + "userMatrix.file"));
            userMatrixStream.writeObject(userMatrix);
            userMatrixStream.close();

            ObjectOutputStream roomMatrixStream = new ObjectOutputStream(new FileOutputStream(path + "roomMatrix.file"));
            roomMatrixStream.writeObject(roomMatrix);
            roomMatrixStream.close();

            log.info("-- SUCCESS --");
        } catch (IOException e){
            log.error("Could not save results of recommendation algorithm to disk");
            System.out.println(Arrays.toString(e.getStackTrace()));
        }
    }

    private String getDataDirectoryPath() throws IOException {
        String directoryPath = resourceLoader.getResource("classpath:").getFile().getAbsolutePath() +
                Configuration.DATA_SUBFOLDER;

        Path path = Path.of(directoryPath);
        if(!Files.exists(path))
            Files.createDirectories(path);

        return directoryPath + "/";
    }
}