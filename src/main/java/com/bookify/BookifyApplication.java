package com.bookify;

import com.bookify.role.Role;
import com.bookify.role.RoleRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
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
	CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder){
		return args -> {
			if(roleRepository.findByAuthority("admin").isPresent()) return;

			Role adminRole = roleRepository.save(new Role("admin"));
			Role userRole = roleRepository.save(new Role("user"));

			Set<Role> adminRoles = new HashSet<>();
			adminRoles.add(adminRole);

			String encodedAdminPassword = passwordEncoder.encode("1234");

			userRepository.save(new User(1, "admin", "admin", "admin",
					"admin@gmail.com", "", encodedAdminPassword, adminRoles));
		};
	}
}