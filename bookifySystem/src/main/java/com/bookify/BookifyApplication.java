package com.bookify;

import com.bookify.configuration.Configuration;
import com.bookify.images.Image;
import com.bookify.images.ImageRepository;
import com.bookify.role.Role;
import com.bookify.role.RoleRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.Constants;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class BookifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookifyApplication.class, args);
	}

	@Bean
	CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, ImageRepository imageRepository,
						  PasswordEncoder passwordEncoder){
		return args -> {
			if(roleRepository.findByAuthority(Constants.ADMIN_ROLE).isPresent()) return;

			Role adminRole = roleRepository.save(new Role(Constants.ADMIN_ROLE));
			roleRepository.save(new Role(Constants.TENANT_ROLE));
			roleRepository.save(new Role(Constants.HOST_ROLE));
			roleRepository.save(new Role(Constants.INACTIVE_HOST_ROLE));

			Set<Role> adminRoles = new HashSet<>();
			adminRoles.add(adminRole);

			imageRepository.save(new Image(Configuration.DEFAULT_PROFILE_PIC_NAME));

			String encodedAdminPassword = passwordEncoder.encode(Configuration.ADMIN_PASSWORD);
			Image profilePic = imageRepository.findByImageGuid(Configuration.DEFAULT_PROFILE_PIC_NAME).get();

			userRepository.save(new User(1L, Configuration.ADMIN_USERNAME, Configuration.ADMIN_USERNAME,
					Configuration.ADMIN_USERNAME,"admin@gmail.com", "", encodedAdminPassword, profilePic,
					adminRoles));
		};
	}
}