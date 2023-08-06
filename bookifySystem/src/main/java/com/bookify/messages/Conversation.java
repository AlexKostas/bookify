package com.bookify.messages;

import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long conversationID;

    @OneToOne
    private User member1;

    @OneToOne
    private User member2;

    private String topic;

    private boolean isRead;

    public Conversation(){
        isRead = false;
    }

    public Conversation(User member1, User member2, String topic) {
        this.member1 = member1;
        this.member2 = member2;
        this.topic = topic.isEmpty() ? "No Topic" : topic;

        isRead = false;
    }

    public void markAsRead(){
        isRead = true;
    }
}