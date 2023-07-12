package com.bookify.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Component
public class ImageFormatDetector {
    public String getImageFormat(MultipartFile image) throws IOException {
        InputStream inputStream = image.getInputStream();

        byte[] signature = new byte[8];
        if (inputStream.read(signature) == 8) {
            if (isJPEG(signature))
                return "jpg";
            else if (isPNG(signature))
                return "png";
        }

        throw new IllegalArgumentException("Image format not supported");
    }

    // Checks if the file signature matches the JPEG magic number
    private boolean isJPEG(byte[] signature) {
        return signature[0] == (byte) 0xFF && signature[1] == (byte) 0xD8;
    }

    // Checks if the file signature matches the PNG magic number
    private boolean isPNG(byte[] signature) {
        return signature[0] == (byte) 0x89 && signature[1] == 0x50 && signature[2] == 0x4E && signature[3] == 0x47
                && signature[4] == 0x0D && signature[5] == 0x0A && signature[6] == 0x1A && signature[7] == 0x0A;
    }
}
