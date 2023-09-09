package com.bookify.search;

import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Table(name = "searches")
public class SearchEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "search_entry_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String city;
    private String state;
    private String country;

    public SearchEntry(User user, String city, String state, String country) {
        this.user = user;
        this.city = city;
        this.state = state;
        this.country = country;
    }
}