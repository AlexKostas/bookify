package com.bookify.registration;

import com.bookify.user.User;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/registration")
public class RegistrationController {

    private RegistrationService registrationService;

    @GetMapping("/register")
    public User Register(@RequestBody RegistrationDTO registrationDTO){
        return registrationService.registerUser(registrationDTO);
    }

    @GetMapping("/login")
    public LoginResponseDTO Login(@RequestBody LoginDTO loginDTO){
        return registrationService.loginUser(loginDTO);
    }
}
