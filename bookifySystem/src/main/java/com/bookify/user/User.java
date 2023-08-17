package com.bookify.user;

import com.bookify.authentication.RefreshToken;
import com.bookify.images.Image;
import com.bookify.role.Role;
import com.bookify.room.Room;
import com.bookify.utils.Constants;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.thoughtworks.xstream.annotations.XStreamOmitField;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Data
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
    private LocalDate memberSince;

    @Column(length=1000)
    private String aboutInfo;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "refresh_token_id", referencedColumnName = "token")
    private RefreshToken refreshToken;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    private Image profilePicture;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role_relationship",
            joinColumns = {@JoinColumn(name="app_user_ID")},
            inverseJoinColumns = {@JoinColumn(name="app_role_ID")})
    private Set<Role> roles;

    @JsonBackReference
    @XStreamOmitField
    @OneToMany(mappedBy = "roomHost", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Room> rooms;

    public User(){
        super();
        this.roles = new HashSet<>();
    }

    public User(String username, String firstName, String lastName, String email, String phoneNumber, String password, Image profilePicture, Set<Role> roles) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.profilePicture = profilePicture;
        this.roles = roles;
        this.memberSince = LocalDate.now();
        this.aboutInfo = "";

        this.refreshToken = null;
    }

    public String getRolePreference(){
        //TODO: Maybe store the preference in the database on signup to get rid of this boilerplate code

        boolean hasHostRole = false;
        boolean hasTenantRole = false;
        boolean hasInactiveHostRole = false;
        boolean hasAdminRole = false;

        for (Role role : roles) {
            if (Constants.HOST_ROLE.equals(role.getAuthority()))
                hasHostRole = true;
            else if (Constants.TENANT_ROLE.equals(role.getAuthority()))
                hasTenantRole = true;
            else if (Constants.INACTIVE_HOST_ROLE.equals(role.getAuthority()))
                hasInactiveHostRole = true;
            else if (Constants.ADMIN_ROLE.equals(role.getAuthority()))
                hasAdminRole = true;
        }

        if((hasHostRole || hasInactiveHostRole) && hasTenantRole) return Constants.HOST_TENANT_PREF_ROLE;
        if(hasHostRole || hasInactiveHostRole) return Constants.HOST_ROLE;
        if(hasTenantRole) return Constants.TENANT_ROLE;
        if(hasAdminRole) return Constants.ADMIN_ROLE;

        return "";
    }

    public List<String> getRoleAuthorityList(){
        List<String> result = new ArrayList<>();
        for(Role role : roles)
            result.add(role.getAuthority());

        return result;
    }

    public String getScope(){
        return getAuthorities().stream().
                map(GrantedAuthority::getAuthority).
                collect(Collectors.joining(" "));
    }

    public boolean isAdmin(){
        return hasRole(Constants.ADMIN_ROLE);
    }

    public boolean isHost() { return hasRole(Constants.HOST_ROLE); }

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

    public void assignRoom(Room room){
        rooms.add(room);
    }

    public void unassignRoom(Room room){
        rooms.remove(room);
    }

    public void replaceRefreshToken(RefreshToken newToken){
        refreshToken = newToken;
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
        for(Role role : roles)
            if(role.getAuthority().equals(roleName)) return true;
        return false;
    }
}