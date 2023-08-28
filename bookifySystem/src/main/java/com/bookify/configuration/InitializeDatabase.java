package com.bookify.configuration;

import com.bookify.images.Image;
import com.bookify.images.ImageRepository;
import com.bookify.recommendation.RecommendationService;
import com.bookify.role.Role;
import com.bookify.role.RoleRepository;
import com.bookify.room.Room;
import com.bookify.room_amenities.Amenity;
import com.bookify.room_amenities.AmenityRepository;
import com.bookify.room_type.RoomType;
import com.bookify.room_type.RoomTypeRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
@Slf4j
public class InitializeDatabase {
    @Bean
    CommandLineRunner initializeDB(RoleRepository roleRepository, UserRepository userRepository,
                                   ImageRepository imageRepository, AmenityRepository amenityRepository,
                                   RoomTypeRepository roomTypeRepository, PasswordEncoder passwordEncoder, RecommendationService recommendationService){
        return args -> {
            if(roleRepository.findByAuthority(Constants.ADMIN_ROLE).isPresent()) return;

            preloadAmenities(amenityRepository);
            preloadRoomTypes(roomTypeRepository);
            preloadRoles(roleRepository);
            preloadDefaultImages(imageRepository);
            preloadAdminUser(roleRepository, userRepository, imageRepository, passwordEncoder);
        };
    }

    private void preloadRoles(RoleRepository roleRepository){
        log.info("Preloading necessary roles to database");

        roleRepository.save(new Role(Constants.ADMIN_ROLE));
        roleRepository.save(new Role(Constants.TENANT_ROLE));
        roleRepository.save(new Role(Constants.HOST_ROLE));
        roleRepository.save(new Role(Constants.INACTIVE_HOST_ROLE));
    }

    private void preloadDefaultImages(ImageRepository imageRepository){
        log.info("Preloading default room picture to database");
        imageRepository.save(new Image(com.bookify.configuration.Configuration.DEFAULT_ROOM_THUMBNAIL_NAME,
                com.bookify.configuration.Configuration.DEFAULT_ROOM_THUMBNAIL_EXTENSION));
    }

    private void preloadAdminUser(RoleRepository roleRepository, UserRepository userRepository,
                                  ImageRepository imageRepository, PasswordEncoder passwordEncoder){
        log.info("Preloading admin user to database");

        Role adminRole = roleRepository.findByAuthority(Constants.ADMIN_ROLE).get();

        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);

        String encodedAdminPassword = passwordEncoder.encode(com.bookify.configuration.Configuration.ADMIN_PASSWORD);
        Image profilePic = new Image(com.bookify.configuration.Configuration.DEFAULT_PROFILE_PIC_NAME,
                com.bookify.configuration.Configuration.DEFAULT_PROFILE_PIC_EXTENSION);

        userRepository.save(new User(
                com.bookify.configuration.Configuration.ADMIN_USERNAME,
                com.bookify.configuration.Configuration.ADMIN_USERNAME,
                com.bookify.configuration.Configuration.ADMIN_USERNAME,
                "admin@gmail.com", "",
                encodedAdminPassword,
                profilePic,
                adminRoles,
                Constants.ADMIN_ROLE));
    }

    private void preloadAmenities(AmenityRepository amenityRepository){
        log.info("Preloading amenities to the database");

        amenityRepository.save(new Amenity("Wi-Fi", "Stay connected with free Wi-Fi access throughout your stay"));
        amenityRepository.save(new Amenity("Air condition", "Enjoy a comfortable atmosphere with adjustable air conditioning"));
        amenityRepository.save(new Amenity("Heating", "Stay warm and cozy during colder days with efficient heating"));
        amenityRepository.save(new Amenity("Kitchen", "Prepare your own meals in a fully-equipped kitchen with modern appliances"));
        amenityRepository.save(new Amenity("TV", " Relax and unwind with a variety of entertainment options on a flat-screen TV"));
        amenityRepository.save(new Amenity("Parking", "Convenient on-site parking available for your vehicle"));
        amenityRepository.save(new Amenity("Elevator", "Easily access your accommodation with the convenience of an elevator"));
        amenityRepository.save(new Amenity("Living Room", "A spacious living area to gather, relax, and socialize with fellow guests"));
    }

    private void preloadRoomTypes(RoomTypeRepository roomTypeRepository){
        log.info("Preloading room types to the database");

        roomTypeRepository.save(new RoomType("Private Room"));
        roomTypeRepository.save(new RoomType("Shared Room"));
        roomTypeRepository.save(new RoomType("Entire Home"));
    }
}