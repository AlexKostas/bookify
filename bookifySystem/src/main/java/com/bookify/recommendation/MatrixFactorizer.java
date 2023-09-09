package com.bookify.recommendation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static com.bookify.recommendation.MatrixUtility.*;

@Component
@Slf4j
public class MatrixFactorizer {

    private final int K = 10;
    private final double alpha = 0.002;
    private final double beta = 0.02;
    private double errorThreshold = 0.01;

    public List<double[][]> factorize(double[][] ratingMatrix, int maxIterations){
        int userCount = ratingMatrix.length;
        int itemCount = ratingMatrix[0].length;

//        printMatrix(ratingMatrix);

        double[][] userMatrix = new double[userCount][K];
        double[][] itemMatrix = new double[K][itemCount];

        MatrixUtility.randomize(userMatrix, 0, 1);
        MatrixUtility.randomize(itemMatrix, 0, 1);

        for(int iteration = 0; iteration < maxIterations; iteration++){
            for(int i = 0; i < userCount; i++){
                for(int j = 0; j < itemCount; j++) {
                    if(ratingMatrix[i][j] <= 0) continue;

                    double error = ratingMatrix[i][j] - dotProduct(userMatrix, itemMatrix, i, j);

                    for(int k = 0; k < K; k++){
                        userMatrix[i][k] += alpha * (2 * error * itemMatrix[k][j] - beta * userMatrix[i][k]);
                        itemMatrix[k][j] += alpha * (2 * error * userMatrix[i][k] - beta * itemMatrix[k][j]);
                    }
                }
            }

            double error = computeError(ratingMatrix, userMatrix, itemMatrix);

            log.info("Iteration: " + (iteration + 1) + "/" + maxIterations);
            log.info("Error: " + error);

            if(error < errorThreshold) break;
        }
        System.out.println();
//        printMatrix(matrixMultiply(userMatrix, itemMatrix));


        List<double[][]> result = new ArrayList<>();
        result.add(userMatrix);
        result.add(itemMatrix);

        return result;
    }

    private double computeError(double[][] ratingMatrix, double[][] userMatrix, double[][] itemMatrix) {
        int numUsers = ratingMatrix.length;
        int numItems = ratingMatrix[0].length;

        double error = 0.0;

        for (int i = 0; i < numUsers; i++) {
            for (int j = 0; j < numItems; j++) {
                if (ratingMatrix[i][j] <= 0)
                    continue;

                double prediction = dotProduct(userMatrix, itemMatrix, i, j);

                double ratingError = ratingMatrix[i][j] - prediction;
                error += square(ratingError);

                for (int k = 0; k < K; k++) {
                    error += (beta / 2) * (square(userMatrix[i][k]) + square(itemMatrix[k][j]));
                }
            }
        }

        return error;
    }

    private double square(double number) {
        return number * number;
    }
}