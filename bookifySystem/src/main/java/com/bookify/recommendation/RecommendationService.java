package com.bookify.recommendation;

import com.bookify.reviews.Review;
import com.bookify.reviews.ReviewRepository;
import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.search.SearchPreviewDTO;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.UtilityComponent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

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

    private List<SearchPreviewDTO> topRatedRooms = new ArrayList<>();

    private double[][] userMatrix;
    private double[][] roomMatrix;

    Map<Long, Integer> userDictionary;
    Map<Integer, Integer> roomDictionary;

    public RecommendationService(MatrixFactorizer matrixFactorizer, ReviewRepository reviewRepository,
                                 UserRepository userRepository, RoomRepository roomRepository, UtilityComponent utility) {
        this.matrixFactorizer = matrixFactorizer;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.utility = utility;

        updateTopRatedRooms();
    }

    public List<SearchPreviewDTO> recommend() {
        User currentUser = utility.getCurrentAuthenticatedUserIfExists();

        if(currentUser == null) return topRatedRooms;

        List<Long> userIDs = userRepository.findAllUserIds();
        List<Integer> roomsIDs = roomRepository.findAllRoomIds();

        userDictionary = new HashMap<>();
        roomDictionary = new HashMap<>();

        for(int i = 0; i < userIDs.size(); i++)
            userDictionary.put(userIDs.get(i), i);

        for(int i = 0; i < roomsIDs.size(); i++)
            roomDictionary.put(roomsIDs.get(i), i);

        runRecommendationAlgorithm();

        int numberOfRooms = roomsIDs.size();

        log.info("--Generating recommendations--");
        int userRow = userDictionary.get(currentUser.getUserID());
        RoomRatingPair[] similarities = new RoomRatingPair[numberOfRooms];
        for(int i = 0; i < numberOfRooms; i++) {
            double rating = MatrixUtility.dotProduct(userMatrix, roomMatrix, userRow, i);
            similarities[i] = new RoomRatingPair(rating, roomsIDs.get(i));
        }

        Arrays.sort(similarities, (o1, o2) -> Double.compare(o2.rating, o1.rating));

        List<Room> recommendations = new ArrayList<>();
        for(int i = 0; i < numberOfRecommendations; i++)
            recommendations.add(roomRepository.findById(similarities[i].roomID).get());

        log.info("Finished");

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

    private void runRecommendationAlgorithm( ){
        log.info("---Running Recommendation Algorithm---");

        log.info("--Loading Users--");
        List<Long> userIDs = userRepository.findAllUserIds();
        log.info("--Loading Rooms--");
        List<Integer> roomsIDs = roomRepository.findAllRoomIds();
        log.info("--Loading Reviews--");
        List<Review> reviews = reviewRepository.findAll();

        if(userIDs.isEmpty() || roomsIDs.isEmpty()) {
            log.warn("Can not produce recommendations. REASON: users or rooms array is empty");
            return;
        }

        double[][] ratingMatrix = new double[userIDs.size()][roomsIDs.size()];
        MatrixUtility.zeroOutMatrix(ratingMatrix);

        log.info("--Creating Rating Matrix--");
        for(Review review : reviews){
            int row = userDictionary.get(review.getReviewer().getUserID());
            int column = roomDictionary.get(review.getRoom().getRoomID());

            ratingMatrix[row][column] = review.getStars();
        }

        log.info("--Factorizing Matrix--");
        List<double[][]> result = matrixFactorizer.factorize(ratingMatrix);
        assert(result.size() == 2);

        userMatrix = result.get(0);
        roomMatrix = result.get(1);
    }
}