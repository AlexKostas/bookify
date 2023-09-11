import {useEffect, useState} from "react";
import Navbar from "../components/Navbar/Navbar";
import OldComposeMessage from "../components/ComposeMessage/OldComposeMessage";
import MessageGrid from "../components/MessagesGrid/MessageGrid";
import {useSearchContext} from "../context/SearchContext";
import {useParams} from "react-router-dom";
import ComposeMessage from "../components/ComposeMessage/ComposeMessage";
import Button from "@mui/material/Button";
import MessageIcon from '@mui/icons-material/Message';
import * as React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Grid from "@mui/material/Grid";
import Footer from "../Footer/Footer";

const MessageDashboard = () => {
    const [composePanelActive, setComposePanelActive] = useState(false);
    const { resetSearch } = useSearchContext();
    const { username: recipient } = useParams();
    const [orderDirection, setOrderDirection] = useState('DESC');

    const handleOrderChange = (event) => {
        setOrderDirection(event.target.value);
    };

    useEffect(() => {
        resetSearch();
    }, []);

    useEffect(() => {
        if(recipient) setComposePanelActive(true);
    }, [recipient])

    return (
        <div>
            <Navbar />
            <h1>Inbox</h1>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        onClick={() => setComposePanelActive(true)}
                        endIcon={<MessageIcon />}
                        sx = {{ color: "white", textTransform: 'none', }}
                    >
                        Compose
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <FormControl sx={{ width: '12.5rem' }}>
                        <InputLabel
                            id="order-label"
                            sx={{
                                color: "white",
                                backgroundColor: "dodgerblue",
                            }}
                        >
                            Sort by
                        </InputLabel>
                        <Select
                            id="order"
                            labelId="order-label"
                            value={orderDirection}
                            onChange={handleOrderChange}
                            size="small"
                            sx = {{
                                color: "white",
                                '& .MuiSelect-select': {
                                    fontSize: '20px', // Adjust the font size as needed
                                },
                            }}
                        >
                            <MenuItem value="DESC">Latest Messages First</MenuItem>
                            <MenuItem value="ASC">Earliest Messages First</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            {
                composePanelActive ?  (
                    <ComposeMessage
                            open = {composePanelActive}
                            onClose={() => setComposePanelActive(false)}
                            preloadedRecipient={recipient}
                    />
                    ) : <MessageGrid orderDirection={orderDirection} />
            }
            <Footer/>
        </div>
    );
}

export default MessageDashboard;