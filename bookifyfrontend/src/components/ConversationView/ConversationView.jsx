import {useEffect, useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import './conversationView.css'
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from '@mui/icons-material/Reply';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from '@mui/icons-material/Send';

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

    const reply = async (e) => {
        e.preventDefault();
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
                    <form onSubmit={reply} >

                        <label>Message:</label>
                        <textarea
                            value={replyBody}
                            onChange={(e) => {
                                setReplyBody(e.target.value)
                            }}
                            required
                            className="reply-body"
                        />


                        <div className="reply-actions">
                            <Tooltip title="Cancel">
                                <IconButton color="secondary" onClick={cancelReply}>
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Send Message">
                                <IconButton color="primary" type="submit" >
                                    <SendIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </form>
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