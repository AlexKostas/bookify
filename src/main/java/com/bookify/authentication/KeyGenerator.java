package com.bookify.authentication;

import java.security.KeyPair;
import java.security.KeyPairGenerator;

public class KeyGenerator {
    public static KeyPair generateRSAKey(){
        KeyPair keyPair;

        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            keyPair = keyPairGenerator.generateKeyPair();
        } catch (Exception e){
            throw new IllegalStateException();
        }

        return keyPair;
    }
}
