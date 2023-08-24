package com.bookify.recommendation;
import com.bookify.reviews.ReviewRepository;
import com.bookify.room.Room;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class RecommendationService {

    private final MatrixFactorizer matrixFactorizer;
    private final ReviewRepository reviewRepository;

    public List<Room> recommend() {
        return new ArrayList<>();
    }
}