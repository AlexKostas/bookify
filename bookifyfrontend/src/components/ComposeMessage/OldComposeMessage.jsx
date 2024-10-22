import {useEffect, useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import './composeMessage.css'

const OldComposeMessage = ({open, onClose, preloadedRecipient}) => {
    const [recipient, setRecipient] = useState('');
    const [topic, setTopic] = useState('');
    const [messageBody, setMessageBody] = useState('');
    const [error, setError] = useState(null);

    const axiosPrivate = useAxiosPrivate();

    const clearError = () => setError(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        
        try {
            await axiosPrivate.post('/messages/compose', {
                recipientUsername: recipient.trim(),
                topic: topic.trim(),
                body: messageBody.trim()
            });

            setRecipient('');
            setTopic('');
            setMessageBody('');
            onClose();
        } 
        catch (error) {
            if(!error.response){
                setError('No server response. Is the server running?');
            }
            else {
                if(error.response.status === 404){
                    setError(`User with username ${recipient} not found`);
                }
                else if(error.response.status === 403){
                    setError('Sending messages to yourself is not allowed');
                }
                else {
                    setError('An error occured while sending the message. Please check the console for more details');
                }
            }
        }
    };

    useEffect(() => {
        if(preloadedRecipient) setRecipient(preloadedRecipient);
    }, [preloadedRecipient]);

    return (
        <div>
            <Dialog open={open} onClose={onClose} maxWidth="md">
                <DialogTitle>New Message</DialogTitle>
                <DialogContent>
                    {
                        error && (
                            <Alert severity="error" onClose={clearError}>
                                <AlertTitle>Error</AlertTitle>
                                {error}
                            </Alert>
                        )
                    }

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="label" >Recipient:</label>
                            <input
                                type="text"
                                value={recipient}
                                onChange={(e) => {
                                    setRecipient(e.target.value);
                                    setError(null);
                                }}
                                required
                                className="recipient-input"
                            />
                        </div>

                        <div className="topic-field">
                            <label className="label" >Topic:</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => {
                                    setTopic(e.target.value);
                                    setError(null);
                                }}
                                required
                                className="topic-input"
                            />
                        </div>

                        <label>Message:</label>
                        <textarea
                            value={messageBody}
                            onChange={(e) => {
                                setMessageBody(e.target.value);
                                setError(null);
                            }}
                            required
                            className="message-body"
                        />
                        <button type="submit">Send Message</button>
                    </form>
                </DialogContent>
                <button onClick={() => onClose()}>Close</button>
            </Dialog>
        </div>
    )
}

export default OldComposeMessage;