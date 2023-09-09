import {useEffect, useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import './composeMessage.css'
import TextField from "@mui/material/TextField";
import * as React from "react";
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import CustomDialogTitle from "./CustomDialogTitle";

const ComposeMessage = ({open, onClose, preloadedRecipient}) => {
    const [recipient, setRecipient] = useState('');
    const [topic, setTopic] = useState('');
    const [messageBody, setMessageBody] = useState('');
    const [error, setError] = useState(null);

    const axiosPrivate = useAxiosPrivate();

    const validSend = recipient;

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
                <DialogTitle sx={{ backgroundColor: '#003580', color: 'white' }}>
                    <CustomDialogTitle title={"New Message"} onClose={onClose} withClose={true}/>
                </DialogTitle>
                <DialogContent>
                    {
                        error && (
                            <Alert severity="error" onClose={clearError}>
                                <AlertTitle>Error</AlertTitle>
                                {error}
                            </Alert>
                        )
                    }

                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={12} >
                                <TextField
                                    name="recipient"
                                    required
                                    fullWidth
                                    size="small"
                                    type="text"
                                    id="phonenumber"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setRecipient(e.target.value);
                                        setError(null);
                                    }}
                                    value={recipient}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Recipient:</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={10} >
                                <TextField
                                    name="topic"
                                    required
                                    size="small"
                                    fullWidth
                                    type="text"
                                    id="topic"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setTopic(e.target.value);
                                        setError(null);
                                    }}
                                    value={topic}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Topic:</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    id="message-body"
                                    fullWidth
                                    multiline
                                    minRows={6}
                                    maxRows={6}
                                    value={messageBody}
                                    label={"Message"}
                                    onChange={(e) => {
                                        setMessageBody(e.target.value);
                                        setError(null);
                                    }}
                                    inputProps={{ maxLength: 5000 }}
                                    style={{ resize: 'none' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 1.5, mb: 0, ml: 88 }}
                            endIcon={<SendIcon />}
                            disabled={!validSend}
                        >
                            Send
                        </Button>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ComposeMessage;