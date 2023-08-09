package com.bookify.messages;

import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "inbox_entries")
public class InboxEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long entryID;

    @ManyToOne
    private User user;

    @ManyToOne
    private Conversation conversation;

    //@Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isRead;
    //@Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isDeleted;

    public InboxEntry(){
        isRead = false;
        isDeleted = false;
    }

    public InboxEntry(User user, Conversation conversation) {
        this.user = user;
        this.conversation = conversation;

        isRead = false;
        isDeleted = false;
    }

    public void markRead(){
        isRead = true;
    }

    public void markUnread(){
        isRead = false;
    }

    public void delete(){
        isDeleted = true;
    }
}
