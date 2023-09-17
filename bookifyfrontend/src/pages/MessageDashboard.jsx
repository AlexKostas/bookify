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
import './styles/page.css';
import Typography from "@mui/material/Typography";

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
        <div className="page-container">
            <Navbar />
            <div className="content">
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: "2rem",
                        padding: "1rem",
                        color: "#333",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                        textAlign: "center",
                    }}
                >
                    Inbox
                </Typography>
                <div className="page-buttons-container">
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <Button
                                variant="contained"
                                onClick={() => setComposePanelActive(true)}
                                endIcon={<MessageIcon />}
                            >
                                Compose
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl sx={{ width: '12.5rem' }}>
                                <InputLabel
                                    id="order-label"
                                    sx={{
                                        backgroundColor: "white",
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
                                        '& .MuiSelect-select': {
                                            fontSize: '1rem',
                                        },
                                    }}
                                >
                                    <MenuItem value="DESC">Latest Messages First</MenuItem>
                                    <MenuItem value="ASC">Earliest Messages First</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
                {
                    composePanelActive ?  (
                        <ComposeMessage
                                open = {composePanelActive}
                                onClose={() => setComposePanelActive(false)}
                                preloadedRecipient={recipient}
                        />
                        ) : <MessageGrid orderDirection={orderDirection} />
                }
            </div>
            <Footer/>
        </div>
    );
}

export default MessageDashboard;