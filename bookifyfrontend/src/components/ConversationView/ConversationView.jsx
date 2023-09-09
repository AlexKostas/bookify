import {useEffect, useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import './conversationView.css'
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from '@mui/icons-material/Reply';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from '@mui/icons-material/Send';
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import * as React from "react";
import Box from "@mui/material/Box";

const ConversationView = ({conversationID, readonly, onClose}) => {
    const [messages, setMessages] = useState([]);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyBody, setReplyBody] = useState('');

    const axiosPrivate = useAxiosPrivate();

    const cancelReply = () => {
        setReplyOpen(false);
        setReplyBody('');
    }

    const fetchMessages = async () => {
        const endpointURL = `messages/getMessages/${conversationID}`;

        try {
            const response = await axiosPrivate.get(endpointURL);
            setMessages(response.data);
        }
        catch (error){
            console.log(error);
        }
    }

    const reply = async () => {
        const endpointURL = `/messages/reply/${conversationID}`;

        try {
            await axiosPrivate.post(endpointURL, {
                recipientUsername: '',
                topic: '',
                body: replyBody.trim()
            });

            cancelReply();
            fetchMessages();
        }
        catch (error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    const formatMessageBody = (body, lineBeginning) => {
        return body
            .split('\n')
            .map((line) => `${lineBeginning}${line}`)
            .join('\n');
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        });
    }

    const deleteConversation = async (conversationID) => {
        try{
            const endpointURL = `messages/delete/${conversationID}`;
            await axiosPrivate.delete(endpointURL);
            onClose();
        }
        catch (error){
            console.log(error);
        }
    }

    return (
        <div>
            {
                replyOpen ? (
                    <Box
                        component="form"
                        noValidate
                        sx={{ mt: 0, width: "35rem" }}
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await reply();
                        }}
                    >
                        <Grid
                            container
                            spacing={1}
                            justifyContent="flex-end"
                        >
                            <Grid item xs={12} >
                                <TextField
                                    id="reply-body"
                                    fullWidth
                                    multiline
                                    minRows={7}
                                    maxRows={7}
                                    value={replyBody}
                                    label={"Message"}
                                    onChange={(e) => {
                                        setReplyBody(e.target.value)
                                    }}
                                    inputProps={{ maxLength: 5000 }}
                                    style={{ resize: 'none' }}
                                />
                            </Grid>
                        </Grid>

                        <div className="reply-actions">
                            <Tooltip title="Cancel">
                                <IconButton
                                    color="secondary"
                                    onClick={cancelReply}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Send Message">
                                <IconButton
                                    color="primary"
                                    type="submit"
                                >
                                    <SendIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>
                </Box>
                ) : (
                    <div className="message-actions">
                        <Tooltip title={readonly ? "This conversation is read-only" : "Reply"}>
                            <span>
                                <IconButton disabled={readonly}
                                            onClick={() => setReplyOpen(true)}
                                            style={readonly? {color:'gray'} : { color: 'blue' }}>
                                    <ReplyIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton style={{ color: 'red' }}
                                        onClick={() => deleteConversation(conversationID)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                )
            }

            <br/>

            {
                messages.map((message, index) => (
                <div key={index}>
                    {
                        index > 0 ? (
                            <>
                                <pre><i>{formatMessageBody(`On ${formatTimestamp(message.timestamp)} user ${message.senderUsername} wrote:`, '> ')}</i></pre>
                                <pre>{formatMessageBody(message.body, '> ')}</pre>
                            </>
                        ) :
                            <>
                                <pre><i>{formatMessageBody(`On ${formatTimestamp(message.timestamp)} user ${message.senderUsername} wrote:`, '')}</i></pre>
                                <br/>
                                <pre>{formatMessageBody(message.body, '')}</pre>
                            </>
                    }
                    <br/>
                </div>
                ))
            }
        </div>
    );
}

export default ConversationView;