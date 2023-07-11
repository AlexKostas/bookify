package com.bookify.images;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    //TODO: support other image types
    public String getImageFilename(){
        return imageGuid + ".png";
    }
}