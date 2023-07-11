package com.bookify.images;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="images")
public class Image {
    @Id
    @Column(name="imageIdentifier")
    private String imageGuid;
}
