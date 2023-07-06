package com.bookify.registration;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/registration")
public class RegistrationController {

    @GetMapping("/register")
    public RegistrationDTO Register(@RequestBody RegistrationDTO registrationDTO){
        return registrationDTO;
    }
}
