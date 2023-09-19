package com.bookify.recommendation;

import com.bookify.booking.Booking;
import com.bookify.booking.BookingRepository;
import com.bookify.reviews.Review;
import com.bookify.reviews.ReviewRepository;
import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.rooms_viewed.ViewedRoomDTO;
import com.bookify.rooms_viewed.ViewedRoomRepository;
import com.bookify.search.SearchEntryDTO;
import com.bookify.search.SearchEntryRepository;
import com.bookify.search.SearchPreviewDTO;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.IOUtility;
import com.bookify.utils.UtilityComponent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
@Slf4j
public class RecommendationService {

    private record RoomRatingPair(double rating, Integer roomID){}

    private final int numberOfRecommendations = 9;

    private final double ratingWeight = 4;
    private final double bookingWeight = 8;
    private final double searchWeight = 0.5;
    private final double viewWeight = 1;

    private final MatrixFactorizer matrixFactorizer;
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ViewedRoomRepository viewedRoomRepository;

    private final SearchEntryRepository searchEntryRepository;

    private final UtilityComponent utility;

    private final IOUtility ioUtility;

    public RecommendationService(MatrixFactorizer matrixFactorizer, ReviewRepository reviewRepository,
                                 BookingRepository bookingRepository, UserRepository userRepository, RoomRepository roomRepository, ViewedRoomRepository viewedRoomRepository, SearchEntryRepository searchEntryRepository, UtilityComponent utility,
                                 IOUtility ioUtility) {
        this.matrixFactorizer = matrixFactorizer;
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.viewedRoomRepository = viewedRoomRepository;
        this.searchEntryRepository = searchEntryRepository;
        this.ioUtility = ioUtility;
        this.utility = utility;
    }

    public List<SearchPreviewDTO> recommend() {
        User currentUser = utility.getCurrentAuthenticatedUserIfExists();

        if(currentUser == null) return getTopRatedRooms();

        if(!ioUtility.recommendationFilesExist()){
            log.warn("Can not produce recommendations. REASON: the first iteration of the algorithm has not yet been" +
                    " completed. Producing recommendations based on top ratings instead");

            return getTopRatedRooms();
        }

        Map<Long, Integer> userDictionary;
        Map<Integer, Integer> roomDictionary;
        double[][] userMatrix;
        double[][] roomMatrix;

        try {
            log.info("-- Reading algorithm results from disk --");

            userDictionary = ioUtility.readUserDictionaryFromDisk();
            roomDictionary = ioUtility.readRoomDictionaryFromDisk();
            userMatrix = ioUtility.readUserMatrixFromDisk();
            roomMatrix = ioUtility.readRoomMatrixFromDisk();

            log.info("-- SUCCESS --");
        } catch (IOException | ClassNotFoundException e) {
            log.error("Could not load results of recommendation algorithm from disk due to an IO related error. " +
                    "Using top rated rooms instead");
            System.out.println(Arrays.toString(e.getStackTrace()));
            return getTopRatedRooms();
        }

        if(!userDictionary.containsKey(currentUser.getUserID())){
            log.warn("Can not produce recommendations. REASON: recommendation algorithm has not yet run since " +
                    "user joined. Producing recommendations based on top ratings instead.");
            return getTopRatedRooms();
        }

        int userRow = userDictionary.get(currentUser.getUserID());
        return produceBestRecommendations(userRow, userMatrix, roomMatrix, roomDictionary);
    }

    public List<SearchPreviewDTO> getTopRatedRooms() {
        List<Room> rooms = roomRepository.findBestRooms().stream()
                .limit(numberOfRecommendations)
                .toList();

        return rooms.stream()
                .map(room -> utility.mapRoomToDTO(room, 1, 3))
                .toList();
    }

    private List<SearchPreviewDTO> produceBestRecommendations(int userRow, double[][] userMatrix, double[][] roomMatrix,
                                                              Map<Integer, Integer> roomDictionary){
        log.info("--Generating recommendations--");

        int numberOfRooms = roomDictionary.size();

        // Generate likely rating values of given user for each room id according to matrix factorization results.
        List<RoomRatingPair> ratings = new ArrayList<>(numberOfRooms);
        // Populating the list with dummy elements so the following loop can work without going out of list's bounds
        for (int i = 0; i < numberOfRooms; i++) ratings.add(null);

        for(Map.Entry<Integer, Integer> room : roomDictionary.entrySet()) {
            double rating = MatrixUtility.dotProduct(userMatrix, roomMatrix, userRow, room.getValue());
            ratings.set(room.getValue(), new RoomRatingPair(rating, room.getKey()));
        }

        // Sort room ids by best rating
        ratings.sort((o1, o2) -> Double.compare(o2.rating, o1.rating));

        // Remove rooms that no longer exist from recommendations
        Set<Integer> roomIDs = roomRepository.findAllRoomIdsSet();
        ratings.removeIf(e -> !roomIDs.contains(e.roomID));

        // Pull the rooms that will be recommended from the database. Make sure we don't recommend more rooms than
        // we have
        List<Room> recommendations = new ArrayList<>();
        for(int i = 0; i < Math.min(numberOfRecommendations, ratings.size()); i++)
            recommendations.add(roomRepository.findById(ratings.get(i).roomID).get());

        // Create the final search preview DTOs for the rooms to be recommended
        return recommendations.stream().map((room)-> utility.mapRoomToDTO(room, 1, 3))
                .toList();
    }

    // Automatically run this task every 30 minutes
    @Scheduled(fixedRate = 1800000)
    private void runRecommendationTask(){
        log.info("----- Running Scheduled Task -----");
        runRecommendationAlgorithm(500);
    }


    private void runRecommendationAlgorithm(int maxIterations){
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

        ioUtility.saveRecommendationResults(userDictionary, roomDictionary, userMatrix, roomMatrix);
    }

    private void populateRatingMatrix(double[][] ratingMatrix, Map<Long, Integer> userDictionary,
                                      Map<Integer, Integer> roomDictionary){
        log.info("--Loading Reviews--");
        List<Review> reviews = reviewRepository.findAll();

        log.info("--Loading Bookings--");
        List<Booking> bookings = bookingRepository.findAll();

        log.info("--Loading Views--");
        List<ViewedRoomDTO> viewedRooms = viewedRoomRepository.getViewedRoomPairs();

        log.info("--Loading Searches--");
        List<SearchEntryDTO> searches = searchEntryRepository.getSearches();

        log.info("--Creating Rating Matrix--");
        for(Review review : reviews){
            int row = userDictionary.get(review.getReviewer().getUserID());
            int column = roomDictionary.get(review.getRoom().getRoomID());

            ratingMatrix[row][column] += ratingWeight * review.getStars();
        }

        for(Booking booking : bookings){
            int row = userDictionary.get(booking.getUser().getUserID());
            int column = roomDictionary.get(booking.getRoom().getRoomID());

            ratingMatrix[row][column] += bookingWeight;
        }

        for(ViewedRoomDTO viewedRoomDTO : viewedRooms){
            int row = userDictionary.get(viewedRoomDTO.userID());
            int column = roomDictionary.get(viewedRoomDTO.roomID());

            ratingMatrix[row][column] += viewWeight * viewedRoomDTO.views();
        }

        for(SearchEntryDTO searchEntry : searches){
            int row = userDictionary.get(searchEntry.userID());
            int column = roomDictionary.get(searchEntry.roomID());

            ratingMatrix[row][column] += searchWeight * searchEntry.searchesCount();
        }
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
}