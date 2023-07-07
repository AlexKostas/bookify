package com.bookify.utils;

public class InappropriatePasswordException extends RuntimeException{
    public InappropriatePasswordException(String message){
        super(message);
    }
}