package com.bookify.configuration;

public class Configuration {
    public static final String ADMIN_USERNAME = "admin";
    public static final String ADMIN_PASSWORD = "1234";

    public static final int MIN_PASSWORD_LENGTH = 4;

    public static final String IMAGES_SUBFOLDER = "/images";
    public static final String DEFAULT_PROFILE_PIC_NAME = "default";
    public static final String DEFAULT_PROFILE_PIC_EXTENSION = "png";

    public static final Long ACCESS_TOKEN_DURATION_SECONDS = 60L;
    public static final Long REFRESH_TOKEN_DURATION_MINUTES = 5L;

    //This is a string because the default request parameters in the controller can only be strings
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_PAGE_INDEX = "0";
    public static final String DEFAULT_SEARCH_ORDER = "asc";

    public static final String MAX_LOCATION_AUTOCOMPLETE_SUGGESTIONS = "10";
}
