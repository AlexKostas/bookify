package com.bookify.messages;

import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.Instant;

@Entity
@Getter
@NoArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long conversationID;

    @ManyToOne
    private User member1;

    @ManyToOne
    private User member2;

    private String topic;

    private boolean readonly;

    private Timestamp lastUpdated;

    public Conversation(User member1, User member2, String topic) {
        this.member1 = member1;
        this.member2 = member2;
        this.topic = topic.isEmpty() ? "No Topic" : topic;

        updateTimeStamp();
        readonly = false;
    }

    public boolean userBelongsToConversation(User user) {
        return user.getUserID() == member1.getUserID() || user.getUserID() == member2.getUserID();
    }

    public User getOtherMember(User user){
        if(user.getUserID() == member1.getUserID()) return member2;
        else if(user.getUserID() == member2.getUserID()) return member1;

        assert(false);
        return null;
    }

    public void markReadonly() {
        readonly = true;
    }

    public void updateTimeStamp(){
        lastUpdated = Timestamp.from(Instant.now());
    }
}