package com.bookify.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class TestUserController {

    @GetMapping("/test")
    public ResponseEntity test(){
        System.out.println("Hi");
        return ResponseEntity.ok().build();
    }
}
