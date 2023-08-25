package com.bookify.recommendation;

import com.bookify.reviews.Review;
import com.bookify.reviews.ReviewRepository;
import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.search.SearchPreviewDTO;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.UtilityComponent;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class RecommendationService {

    private record RoomRatingPair(double rating, Room room){};

    private final int numberOfRecommendations = 9;

    private final MatrixFactorizer matrixFactorizer;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    private final UtilityComponent utility;
    
    public List<SearchPreviewDTO> recommend() {
        User currentUser = utility.getCurrentAuthenticatedUserIfExists();

        if(currentUser == null) return getTopRatedRooms();

        log.info("---Running Recommendation Algorithm---");

        log.info("--Loading Users--");
        List<Long> userIDs = userRepository.findAllUserIds();
        log.info("--Loading Rooms--");
        List<Room> rooms = roomRepository.findAll();
        log.info("--Loading Reviews--");
        List<Review> reviews = reviewRepository.findAll();

        if(userIDs.isEmpty() || rooms.isEmpty()) {
            log.warn("Can not produce recommendations. REASON: users or rooms array is empty");
            return new ArrayList<>();
        }
        
        double[][] ratingMatrix = new double[userIDs.size()][rooms.size()];
        MatrixUtility.zeroOutMatrix(ratingMatrix);

        Map<Long, Integer> userDictionary = new HashMap<>();
        Map<Integer, Integer> roomDictionary = new HashMap<>();

        for(int i = 0; i < userIDs.size(); i++)
            userDictionary.put(userIDs.get(i), i);

        for(int i = 0; i < rooms.size(); i++)
            roomDictionary.put(rooms.get(i).getRoomID(), i);

        log.info("--Creating Rating Matrix--");
        for(Review review : reviews){
            int row = userDictionary.get(review.getReviewer().getUserID());
            int column = roomDictionary.get(review.getRoom().getRoomID());

            ratingMatrix[row][column] = review.getStars();
        }

        log.info("--Factorizing Matrix--");
        List<double[][]> result = matrixFactorizer.factorize(ratingMatrix);
        assert(result.size() == 2);

        double[][] userMatrix = result.get(0);
        double[][] roomMatrix = result.get(1);

        log.info("--Generating recommendations--");
        int userRow = userDictionary.get(currentUser.getUserID());
        RoomRatingPair[] similarities = new RoomRatingPair[rooms.size()];
        for(int i = 0; i < rooms.size(); i++) {
            double rating = MatrixUtility.dotProduct(userMatrix, roomMatrix, userRow, i);
            similarities[i] = new RoomRatingPair(rating, rooms.get(i));
        }

        Arrays.sort(similarities, (o1, o2) -> Double.compare(o2.rating, o1.rating));

        List<Room> recommendations = new ArrayList<>();
        for(int i = 0; i < numberOfRecommendations; i++)
            recommendations.add(similarities[i].room);

        log.info("Finished");

        return recommendations.stream().map((room)-> utility.mapRoomToDTO(room, 1, 3))
                .toList();
    }

    private void runRecommendationAlgorithm(){

    }

    private List<SearchPreviewDTO> getTopRatedRooms() {
        List<Room> rooms = roomRepository.findBestRooms().stream()
                .limit(numberOfRecommendations)
                .toList();
        return rooms.stream()
                .map(room -> utility.mapRoomToDTO(room, 1, 3))
                .toList();
    }
}