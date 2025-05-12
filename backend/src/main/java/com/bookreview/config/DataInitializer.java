package com.bookreview.config;

import com.bookreview.model.User;
import com.bookreview.model.UserRole;
import com.bookreview.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if admin user already exists
        if (userRepository.findByEmail("admin@bookreview.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@bookreview.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Default password
            admin.setRole(UserRole.ADMIN);
            admin.setBio("System Administrator");
            
            userRepository.save(admin);
            System.out.println("Default admin account created successfully");
        }
    }
} 