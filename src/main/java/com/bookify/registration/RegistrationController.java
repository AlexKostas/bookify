package com.bookify.registration;

import com.bookify.utils.InappropriatePasswordException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.naming.OperationNotSupportedException;

@RestController
@AllArgsConstructor
@RequestMapping("/api/registration")
public class RegistrationController {

    private RegistrationService registrationService;

    @PostMapping("/register")
    public String register(@RequestBody RegistrationDTO registrationDTO) {
        try {
            String result = registrationService.registerUser(registrationDTO);
            return result;
        } catch (OperationNotSupportedException | InappropriatePasswordException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
            //return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (IllegalArgumentException e){
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
            //return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
        catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
            //return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/login")
    public LoginResponseDTO Login(@RequestBody LoginDTO loginDTO){
        return registrationService.loginUser(loginDTO);
    }
}
