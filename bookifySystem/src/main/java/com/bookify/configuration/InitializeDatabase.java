package com.bookify.configuration;

import com.bookify.images.Image;
import com.bookify.images.ImageRepository;
import com.bookify.role.Role;
import com.bookify.role.RoleRepository;
import com.bookify.room_amenities.Amenity;
import com.bookify.room_amenities.AmenityRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@Slf4j
public class InitializeDatabase {
    @Bean
    CommandLineRunner initializeDB(RoleRepository roleRepository, UserRepository userRepository,
                                   ImageRepository imageRepository, AmenityRepository amenityRepository,
                                   PasswordEncoder passwordEncoder){
        return args -> {
            if(roleRepository.findByAuthority(Constants.ADMIN_ROLE).isPresent()) return;

            preloadAmenities(amenityRepository);
            preloadRoles(roleRepository);
            //preloadDefaultImages(imageRepository);
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
        log.info("Preloading default profile picture to database");
        imageRepository.save(new Image(com.bookify.configuration.Configuration.DEFAULT_PROFILE_PIC_NAME,
                com.bookify.configuration.Configuration.DEFAULT_PROFILE_PIC_EXTENSION));
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
                adminRoles));
    }

    private void preloadAmenities(AmenityRepository amenityRepository){
        log.info("Preloading amenities to the database");

        //TODO: Fill in descriptions
        amenityRepository.save(new Amenity("Wi-Fi", "Free wifi for tenants"));
        amenityRepository.save(new Amenity("Air condition", "..."));
        amenityRepository.save(new Amenity("Heating", ""));
        amenityRepository.save(new Amenity("Kitchen", ""));
        amenityRepository.save(new Amenity("TV", ""));
        amenityRepository.save(new Amenity("Parking", ""));
        amenityRepository.save(new Amenity("Elevator", ""));
    }
}
