package com.bookify.registration;

import com.bookify.user.User;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.naming.OperationNotSupportedException;

@RestController
@AllArgsConstructor
@RequestMapping("/api/registration")
public class RegistrationController {

    private RegistrationService registrationService;

    @PostMapping("/register")
    public User Register(@RequestBody RegistrationDTO registrationDTO) throws OperationNotSupportedException {
        //TODO: error handling and remove exception
        return registrationService.registerUser(registrationDTO);
    }

    @GetMapping("/login")
    public LoginResponseDTO Login(@RequestBody LoginDTO loginDTO){
        return registrationService.loginUser(loginDTO);
    }
}
