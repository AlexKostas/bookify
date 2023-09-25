package com.bookify.user;

import com.bookify.utils.Constants;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>  {

    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsernameIncludeDeleted(String username);

    @Query("SELECT u FROM User u WHERE u.username = :username AND u.isDeleted = false")
    Optional<User> findByUsername(String username);
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isDeleted = false")
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmailIncludeDeleted(String email);

    @Query("SELECT u FROM User u WHERE u.isDeleted = false")
    Page<User> findAll(Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.authority = '" + Constants.ADMIN_ROLE + "'")
    User findAdmin();

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.authority = '" + Constants.INACTIVE_HOST_ROLE + "' AND u.isDeleted = false")
    Page<User> findAllInactiveHosts(Pageable pageable);

    @Query("SELECT u FROM User  u JOIN u.roles r where r.authority = :roleAuthority and u.isDeleted = false")
    List<User> findAllByRolesAuthority(String roleAuthority);

    @Query("SELECT u.userID FROM User u")
    List<Long> findAllUserIds();
}