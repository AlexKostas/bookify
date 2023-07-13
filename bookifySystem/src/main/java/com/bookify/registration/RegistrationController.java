package com.bookify.registration;

import com.bookify.configuration.Configuration;
import com.bookify.utils.InappropriatePasswordException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import javax.naming.OperationNotSupportedException;

@RestController
@AllArgsConstructor
@RequestMapping("/api/registration")
public class RegistrationController {

    private RegistrationService registrationService;

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegistrationDTO registrationDTO) {
        try {
            LoginRegistrationResponseDTO result = registrationService.registerUser(registrationDTO);
            return ResponseEntity.ok(result);
        } catch (OperationNotSupportedException | InappropriatePasswordException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (IllegalArgumentException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginDTO loginDTO) {
        try {
            LoginRegistrationResponseDTO result = registrationService.loginUser(loginDTO);
            return ResponseEntity.ok(result);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getMinPasswordLength")
    public ResponseEntity<Integer> getMinPasswordLength(){
        return ResponseEntity.ok(Configuration.MIN_PASSWORD_LENGTH);
    }
}
