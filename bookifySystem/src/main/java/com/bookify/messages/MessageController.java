package com.bookify.messages;

import com.bookify.configuration.Configuration;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@AllArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/compose")
    public ResponseEntity<?> compose(@RequestBody MessageRequestDTO messageRequest){
        try{
            messageService.composeMessage(messageRequest);
            return ResponseEntity.ok().build();
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/reply/{conversationID}")
    public ResponseEntity<?> replyToConversation(@PathVariable Long conversationID,
                                                 @RequestBody MessageRequestDTO messageRequest){
        try{
            messageService.replyToMessage(conversationID, messageRequest);
            return ResponseEntity.ok().build();
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{conversationID}")
    public ResponseEntity<?> deleteConversation(@PathVariable Long conversationID){
        try{
            messageService.deleteConversation(conversationID);
            return ResponseEntity.ok().build();
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getConversations")
    public ResponseEntity<?> getConversations(
            @RequestParam(defaultValue = Configuration.DEFAULT_PAGE_INDEX) int pageNumber,
            @RequestParam(defaultValue = Configuration.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = Configuration.DEFAULT_SEARCH_ORDER) String orderDirection
    ){
        try {
            return ResponseEntity.ok(messageService.getConversationsOfUser(pageNumber, pageSize, orderDirection));
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getMessages/{conversationID}")
    public ResponseEntity<?> getMessages(@PathVariable Long conversationID){
        try{
            return ResponseEntity.ok(messageService.readMessagesOfConversation(conversationID));
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (IllegalAccessException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
