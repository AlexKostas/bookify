package com.bookify.role;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

@Entity
@AllArgsConstructor
@Getter
@Setter
@Table(name="ApplicationRole")
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name="role_ID")
    private Integer roleID;

    private String authority;

    public Role(){
        super();
    }

    public Role(String authority){
        this.authority = authority;
    }

    @Override
    public String getAuthority() {
        return authority;
    }
}
