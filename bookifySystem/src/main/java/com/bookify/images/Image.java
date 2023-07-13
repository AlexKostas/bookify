package com.bookify.images;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="images")
public class Image {
    @Id
    @Column(name="imageIdentifier")
    private String imageGuid;

    private String extension;

    public String getImageFilename(){
        return imageGuid + "." + extension;
    }
}