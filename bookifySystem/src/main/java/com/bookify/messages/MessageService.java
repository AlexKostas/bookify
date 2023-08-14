package com.bookify.messages;

import com.bookify.user.User;
import com.bookify.user.UserRepository;
import com.bookify.utils.Constants;
import com.bookify.utils.UtilityComponent;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final InboxEntryRepository inboxEntryRepository;
    private final UserRepository userRepository;
    private final UtilityComponent utility;

    @Transactional
    public void composeMessage(MessageRequestDTO messageRequest) throws EntityNotFoundException, IllegalAccessException {
        User currentUser = utility.getCurrentAuthenticatedUser();
        User recipient = userRepository.findByUsername(messageRequest.recipientUsername()).orElseThrow(() ->
                new EntityNotFoundException("User with username " + messageRequest.recipientUsername() + " not found"));

        if(currentUser.getUserID() == recipient.getUserID())
            throw new IllegalAccessException("Can not send a message to yourself");

        Conversation newConversation = new Conversation(currentUser, recipient, messageRequest.topic());
        conversationRepository.save(newConversation);

        createNewMessage(currentUser, newConversation, messageRequest.body());
    }

    public void sendMessageFromAdmin(String recipientUsername, String topic, String message){
        User admin = userRepository.findByRoles_Authority(Constants.ADMIN_ROLE);
        Optional<User> recipientOptional = userRepository.findByUsername(recipientUsername);

        assert(recipientOptional.isPresent());
        User recipient = recipientOptional.get();

        assert(recipient != admin);

        Conversation newConversation = new Conversation(admin, recipient, topic);
        newConversation.markReadonly();
        conversationRepository.save(newConversation);

        createNewMessage(admin, newConversation, message);
    }

    public void replyToMessage(Long conversationID, MessageRequestDTO messageRequest)
            throws IllegalAccessException, EntityNotFoundException {
        Conversation conversation = conversationRepository.findById(conversationID)
                .orElseThrow(() -> new EntityNotFoundException("Conversation with id " + conversationID + " not found"));

        User currentUser = utility.getCurrentAuthenticatedUser();
        verifyConversationPrivileges(conversation, currentUser);

        if(conversation.isReadonly())
            throw new IllegalAccessException("Can not reply to this conversation because one of the recipients have deleted it");

        createNewMessage(currentUser, conversation, messageRequest.body());

        conversation.updateTimeStamp();
        conversationRepository.save(conversation);
    }

    public void deleteConversation(Long conversationID) throws IllegalAccessException, EntityNotFoundException {
        Conversation conversation = conversationRepository.findById(conversationID)
                .orElseThrow(() -> new EntityNotFoundException("Conversation with id " + conversationID + " not found"));

        User currentUser = utility.getCurrentAuthenticatedUser();
        verifyConversationPrivileges(conversation, currentUser);

        InboxEntry entry = inboxEntryRepository.findByConversationAndUser(conversation, currentUser).get();
        entry.delete();
        inboxEntryRepository.save(entry);
    }

    public Page<ConversationResponseDTO> getConversationsOfUser(int pageNumber, int pageSize, String sortDirection) {
        Sort.Direction direction = Sort.Direction.ASC;
        if(sortDirection.equalsIgnoreCase("desc"))
            direction = Sort.Direction.DESC;

        if(!sortDirection.equalsIgnoreCase("desc") && !sortDirection.equalsIgnoreCase("asc"))
            log.warn("Unknown sorting direction '" + sortDirection + "'. Assuming ascending order. " +
                    "Please use 'asc' or 'desc' to specify the order of the search results");

        User currentUser = utility.getCurrentAuthenticatedUser();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, direction, "lastUpdated");
        Page<Conversation> searchResult = conversationRepository.findAllConversationsOfUser(currentUser.getUserID(), pageable);

        List<ConversationResponseDTO> finalResult = new ArrayList<>();
        for(Conversation conversation : searchResult){
            InboxEntry entry = inboxEntryRepository.findByConversationAndUser(conversation, currentUser).get();

            finalResult.add(new ConversationResponseDTO(
                    conversation.getConversationID(),
                    currentUser.getUsername(),
                    conversation.getOtherMember(currentUser).getUsername(),
                    conversation.getTopic(),
                    conversation.isReadonly(),
                    conversation.getLastUpdated(),
                    entry.isRead()
            ));
        }

        return new PageImpl<>(finalResult, pageable, searchResult.getTotalElements());
    }

    public List<MessageResponseDTO> readMessagesOfConversation(Long conversationID)
            throws IllegalAccessException, EntityNotFoundException {
        Conversation conversation = conversationRepository.findById(conversationID)
                .orElseThrow(() -> new EntityNotFoundException("Conversation with id " + conversationID + " not found"));

        User currentUser = utility.getCurrentAuthenticatedUser();
        verifyConversationPrivileges(conversation, currentUser);

        // Mark as read
        InboxEntry entry = inboxEntryRepository.findByConversationAndUser(conversation, currentUser).get();
        entry.markRead();
        inboxEntryRepository.save(entry);

        List<Message> messages = messageRepository.findAllByConversation_ConversationIDOrderByTimestampDesc(conversationID);

        List<MessageResponseDTO> result = new ArrayList<>();
        for(Message message : messages){
            result.add(new MessageResponseDTO(
                    message.getSender().getUsername(),
                    message.getBody(),
                    message.getTimestamp()
            ));
        }

        return result;
    }

    private void createNewMessage(User sender, Conversation conversation, String body) {
        Timestamp currentTimestamp = Timestamp.from(Instant.now());
        Message newMessage = new Message(sender, conversation, body, currentTimestamp);
        messageRepository.save(newMessage);

        User recipient = conversation.getOtherMember(sender);
        Optional<InboxEntry> entryOptional = inboxEntryRepository.findByConversationAndUser(conversation, recipient);
        InboxEntry entry = entryOptional.orElseGet(() -> new InboxEntry(recipient, conversation));
        entry.markUnread();
        inboxEntryRepository.save(entry);
    }

    private void verifyConversationPrivileges(Conversation conversation, User user) throws IllegalAccessException {
        if(!conversation.userBelongsToConversation(user))
            throw new IllegalAccessException("User " + user.getUsername() + " does not belong " +
                    "to conversation with id " + conversation.getConversationID());
    }
}