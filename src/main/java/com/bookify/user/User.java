package com.bookify.user;

import com.bookify.role.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Table(name="users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="app_user_ID")
    private Long userID;

    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role_relationship",
            joinColumns = {@JoinColumn(name="app_user_ID")},
            inverseJoinColumns = {@JoinColumn(name="app_role_ID")})
    private Set<Role> roles;

    public User(){
        super();
        this.roles = new HashSet<>();
    }

    public String getRolesAsString(){
        StringBuilder builder = new StringBuilder();
        String delimiter = ", ";

        for(Role role : roles) {
            builder.append(role.getAuthority());
            builder.append(delimiter);
        }


        return builder.length() > 0 ? builder.substring(0, builder.length() - delimiter.length()) : "";
    }

    public boolean isAdmin(){
        return hasRole("admin");
    }

    public boolean isInactiveHost(){
        return hasRole("inactive-host");
    }

    public void activateHost(Role hostRole){
        assert(isInactiveHost());
        assert(hostRole.getAuthority() == "host");

        //TODO: remove strings
        roles.removeIf(role -> role.getAuthority().equals("inactive-host"));
        roles.add(hostRole);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    private boolean hasRole(String roleName){
        roleName.trim().toLowerCase();
        for(Role role : roles)
            if(role.getAuthority().toLowerCase().equals(roleName)) return true;
        return false;
    }
}