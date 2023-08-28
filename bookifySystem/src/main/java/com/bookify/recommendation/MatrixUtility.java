package com.bookify.recommendation;

import java.util.Random;

public class MatrixUtility {

    /**
     * This method computes the dot product.
     *
     * @param arr1     2-d double array.
     * @param arr2     2-d double array.
     * @return         The dot product of the arr1[rowIndex][], arr2[][colIndex] vectors.
     */
    public static double dotProduct(double[][] arr1, double[][] arr2, int rowIndex, int colIndex){
        int numCols1 = arr1[0].length;

        double result = 0;
        for (int i = 0; i < numCols1; i++) {
            result += arr1[rowIndex][i] * arr2[i][colIndex];
        }

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
    public static void randomize(double[][] matrix, double minValue, double maxValue){
        Random random = new Random();

        int numRows = matrix.length;
        int numCols = matrix[0].length;

        for (int i = 0; i < numRows; i++) {
            for (int j = 0; j < numCols; j++) {
                matrix[i][j] = minValue + (maxValue - minValue) * random.nextDouble();
            }
        }
    }

    public static double[][] matrixMultiply(double[][] matrixA, double[][] matrixB) {
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

    public static void printMatrix(double[][] array) {
        for (double[] row : array) {
            for (double value : row) {
                System.out.print(String.format("%.3f", value) + " ");
            }
            System.out.println();
        }
        System.out.println();
    }

    public static void zeroOutMatrix(double[][] arr) {
        for(int i = 0; i < arr.length; i++) {
            for(int j = 0; j < arr[0].length; j++) {
                arr[i][j] = 0;
            }
        }
    }
}