package com.bookify.user;

import com.bookify.authentication.RefreshToken;
import com.bookify.images.Image;
import com.bookify.role.Role;
import com.bookify.room.Room;
import com.bookify.utils.Constants;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.thoughtworks.xstream.annotations.XStreamOmitField;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Data
@Table(name="users", indexes = {
        @Index(name = "username_index", columnList = "username", unique = true),
        @Index(name = "email_index", columnList = "email")
})
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="app_user_ID")
    private Long userID;

    @Column(unique = true)
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;

    @JsonIgnore
    private String password;

    private LocalDate memberSince;

    @Column(length=1000)
    private String aboutInfo;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "refresh_token_id", referencedColumnName = "token")
    @JsonManagedReference
    @JsonIgnore
    private RefreshToken refreshToken;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    private Image profilePicture;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role_relationship",
            joinColumns = {@JoinColumn(name="app_user_ID")},
            inverseJoinColumns = {@JoinColumn(name="app_role_ID")})
    private Set<Role> roles;

    @JsonIgnore
    private String rolePreference;

    @JsonBackReference
    @XStreamOmitField
    @OneToMany(mappedBy = "roomHost", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Room> rooms;

    private boolean isDeleted;

    public User(){
        super();
        this.roles = new HashSet<>();
        this.isDeleted = false;
    }

    public User(String username, String firstName, String lastName, String email, String phoneNumber, String password, Image profilePicture, Set<Role> roles, String preferredRoles) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.profilePicture = profilePicture;
        this.roles = roles;
        this.rolePreference = preferredRoles;
        this.memberSince = LocalDate.now();
        this.aboutInfo = "";

        this.refreshToken = null;
        this.isDeleted = false;
    }

    @JsonIgnore
    public List<String> getRoleAuthorityList(){
        List<String> result = new ArrayList<>();
        for(Role role : roles)
            result.add(role.getAuthority());

        return result;
    }

    @JsonIgnore
    public String getScope(){
        return getAuthorities().stream().
                map(GrantedAuthority::getAuthority).
                collect(Collectors.joining(" "));
    }

    @JsonIgnore
    public boolean isAdmin(){
        return hasRole(Constants.ADMIN_ROLE);
    }

    @JsonIgnore
    public boolean isHost() { return hasRole(Constants.HOST_ROLE); }

    @JsonIgnore
    public boolean isInactiveHost(){
        return hasRole(Constants.INACTIVE_HOST_ROLE);
    }

    public void activateHost(Role hostRole){
        assert(isInactiveHost());
        assert(hostRole.getAuthority().equals(Constants.HOST_ROLE));

        roles.removeIf(role -> role.getAuthority().equals(Constants.INACTIVE_HOST_ROLE));
        roles.add(hostRole);
    }

    public void rejectHost(){
        assert(isInactiveHost());
        roles.removeIf(role -> role.getAuthority().equals(Constants.INACTIVE_HOST_ROLE));
    }

    public void delete(){
        isDeleted = true;
    }

    public void assignRoom(Room room){
        rooms.add(room);
    }

    public void unassignRoom(Room room){
        rooms.remove(room);
    }

    public void replaceRefreshToken(RefreshToken newToken){
        refreshToken = newToken;
    }

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return !isDeleted;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return !isDeleted;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return !isDeleted;
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return !isDeleted;
    }

    private boolean hasRole(String roleName){
        for(Role role : roles)
            if(role.getAuthority().equals(roleName)) return true;
        return false;
    }
}