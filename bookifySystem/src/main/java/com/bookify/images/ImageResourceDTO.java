package com.bookify.images;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;

public record ImageResourceDTO(FileSystemResource resource, MediaType mediaType) {}