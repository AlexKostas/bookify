package com.bookify.messages;

import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Getter
@NoArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long messageID;

    @ManyToOne
    @Column(nullable = false)
    private User sender;

    @ManyToOne
    @Column(nullable = false)
    private Conversation conversation;

    @Column(length = 5000)
    private String body;

    private Timestamp timestamp;

    public Message(User sender, Conversation conversation, String body, Timestamp timestamp) {
        this.sender = sender;
        this.conversation = conversation;
        this.body = body;
        this.timestamp = timestamp;
    }
}