package com.calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.calendar.dto.SignupRequest;
import com.calendar.model.Role;
import com.calendar.repository.UserRepository;
import com.calendar.service.UserService;

@SpringBootApplication
public class CalendarApplication {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    public static void main(String[] args) {
        SpringApplication.run(CalendarApplication.class, args);
    }
    
    @Bean
    public CommandLineRunner initializeDefaultAdmin() {
        return args -> {
            // Clear all existing users to avoid conflicts on application restart
            // This is for development purposes only - remove in production
            userRepository.deleteAll();
            
            // Create default admin account
            SignupRequest signupRequest = new SignupRequest();
            signupRequest.setUsername("boss");
            signupRequest.setPassword("1");
            signupRequest.setEmail("admin@calendar.app");
            signupRequest.setFullName("System Administrator");
            
            userService.createUser(signupRequest, Role.ADMIN);
            
            System.out.println("Default admin user created: username='boss', password='1'");
        };
    }
} 