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
public interface UserRepository extends JpaRepository<User, Integer>  {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    Page<User> findAll(Pageable pageable);

    User findByRoles_Authority(String authority);

    @Query("select u from User u join u.roles r where r.authority = 'inactive-host'")
    Page<User> findAllInactiveHosts(Pageable pageable);

    List<User> findAllByRolesAuthority(String roleAuthority);

    @Query("SELECT u.userID FROM User u")
    List<Long> findAllUserIds();
}