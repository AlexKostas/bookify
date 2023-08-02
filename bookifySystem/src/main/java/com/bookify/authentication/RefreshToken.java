package com.bookify.authentication;

import com.bookify.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshToken {
    @Id
    private String token;
    private Instant expirationDate;

    @OneToOne(mappedBy = "refreshToken")
    private User user;

    public RefreshToken(String token, Instant expirationDate) {
        this.token = token;
        this.expirationDate = expirationDate;
    }

    public boolean isExpired(){
        return Instant.now().isAfter(expirationDate);
    }
}
