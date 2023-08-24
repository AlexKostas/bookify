package com.bookify.recommendation;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class MatrixFactorizer {

    private final int K = 100;
    private final int maxIterations = 10000;
    private final double alpha = 0.002;
    private final double beta = 0.02;
    private double errorThreshold = 0.0001;

    private List<double[][]> factorize(double[][] ratingMatrix){
        int userCount = ratingMatrix.length;
        int itemCount = ratingMatrix[0].length;

        double[][] userMatrix = new double[userCount][K];
        double[][] itemMatrix = new double[K][itemCount];

        randomize(userMatrix, 0, 1);
        randomize(itemMatrix, 0, 1);

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
            if(error < errorThreshold) break;
        }

        List<double[][]> result = new ArrayList<>();
        result.add(userMatrix);
        result.add(itemMatrix);

        return result;
    }


    /**
     * This method initializes a given matrix with random values
     * between minValue and maxValue.
     *
     * @param matrix   The matrix to be randomized.
     * @param minValue The lower bound of random values (chosen 0.0).
     * @param maxValue The upper bound of random values (chosen 1.0).
     */
    private void randomize(double[][] matrix, double minValue, double maxValue){
        Random random = new Random();

        int numRows = matrix.length;
        int numCols = matrix[0].length;

        for (int i = 0; i < numRows; i++) {
            for (int j = 0; j < numCols; j++) {
                matrix[i][j] = minValue + (maxValue - minValue) * random.nextDouble();
            }
        }
    }

    /**
     * This method computes the dot product.
     *
     * @param arr1     2-d double array.
     * @param arr2     2-d double array.
     * @return         The dot product of the arr1[rowIndex][], arr2[][colIndex] vectors.
     */
    private double dotProduct(double[][] arr1, double[][] arr2, int rowIndex, int colIndex){
        int numRows1 = arr1.length;
        int numCols1 = arr1[0].length;

        int numCols2 = arr2[0].length;

        assert(numRows1 == numCols2);           // Validate if dot product is possible

        double result = 0;
        for (int i = 0; i < numCols1; i++) {
            result += arr1[rowIndex][i] * arr2[i][colIndex];
        }

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

    private double[][] matrixMultiply(double[][] matrixA, double[][] matrixB) {
        int numRowsA = matrixA.length;
        int numColsA = matrixA[0].length;
        int numRowsB = matrixB.length;
        int numColsB = matrixB[0].length;

        if (numColsA != numRowsB) {
            throw new IllegalArgumentException("Matrix dimensions are not compatible for multiplication");
        }

        double[][] result = new double[numRowsA][numColsB];

        for (int i = 0; i < numRowsA; i++)
            for (int j = 0; j < numColsB; j++)
                result[i][j] = dotProduct(matrixA, matrixB, i, j);

        return result;
    }

    private void printArray(double[][] array) {
        for (double[] row : array) {
            for (double value : row) {
                System.out.print(String.format("%.3f", value) + " ");
            }
            System.out.println();
        }
        System.out.println();
    }

    private double square(double number) {
        return number * number;
    }
}
