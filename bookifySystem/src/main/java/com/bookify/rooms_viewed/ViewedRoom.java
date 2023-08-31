package com.bookify.rooms_viewed;

import com.bookify.room.Room;
import com.bookify.user.User;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Table(name = "viewed_room")
public class ViewedRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "viewed_room_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "room_id")
    private Room room;

    public ViewedRoom(User user, Room room) {
        this.user = user;
        this.room = room;
    }
}
