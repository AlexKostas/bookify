package com.bookify.admin;

import com.bookify.messages.MessageService;
import com.bookify.role.Role;
import com.bookify.role.RoleRepository;
import com.bookify.room.Room;
import com.bookify.room.RoomRepository;
import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.github.underscore.U;
import com.thoughtworks.xstream.XStream;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class AdminService {

    private final MessageService messageService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RoomRepository roomRepository;

    public Page<UserResponseDTOForAdmin> getAllUsers(int pageNumber, int pageSize){
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<User> searchResult = userRepository.findAll(pageable);

        //TODO: refactor this
        List<UserResponseDTOForAdmin> result = new ArrayList<>();

        for(User user : searchResult){
            if(user.isAdmin()) continue;

            result.add(new UserResponseDTOForAdmin(
                    user.getUserID(),
                    user.getUsername(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRoleAuthorityList()
            ));
        }

        return new PageImpl<>(result, pageable, searchResult.getTotalElements());
    }

    public Page<UserResponseDTOForAdmin> getAllInactiveHosts(int pageNumber, int pageSize){
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<User> searchResult = userRepository.findAllInactiveHosts(pageable);

        List<UserResponseDTOForAdmin> result = new ArrayList<>();

        for(User user : searchResult){
            if(user.isAdmin()) continue;

            result.add(new UserResponseDTOForAdmin(
                    user.getUserID(),
                    user.getUsername(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRoleAuthorityList()
            ));
        }

        return new PageImpl<>(result, pageable, searchResult.getTotalElements());
    }
    public void approveHost(String username) throws UsernameNotFoundException, UnsupportedOperationException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));

        if(user.isAdmin()) throw new UnsupportedOperationException("Can not approve an admin user");
        if(!user.isInactiveHost()) throw new UnsupportedOperationException("Can not approve an already active host or" +
                "a tenant");

        Role hostRole = roleRepository.findByAuthority("host").get();
        user.activateHost(hostRole);
        userRepository.save(user);

        messageService.sendMessageFromAdmin(
                user.getUsername(),
                "Host Application",
                "We are happy to inform you that your host application has been accepted! \n\nYou are now free to" +
                        " visit the host dashboard and start registering rooms."
        );
    }

    public void rejectHost(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));

        if(user.isAdmin()) throw new UnsupportedOperationException("Can not reject an admin user");
        if(!user.isInactiveHost()) throw new UnsupportedOperationException("Can not reject an already active host or" +
                "a tenant");

        user.rejectHost();
        userRepository.save(user);

        messageService.sendMessageFromAdmin(
                user.getUsername(),
                "Host Application",
                "We are sorry to inform you that your host application has been rejected! \n\nYou will be" +
                        " allowed to apply again at a future date."
        );
    }

    public String getAppDataJSON() throws JsonProcessingException {
        List<Room> rooms = roomRepository.findAll();

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        String json = objectMapper.writeValueAsString(rooms);
        return json;
    }

    public String getAppDataXML() throws JsonProcessingException {
        String json = getAppDataJSON();
        return U.jsonToXml(json);
    }
}