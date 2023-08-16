import {useEffect, useState} from 'react';
import {Box, Container, Grid, Paper, Typography} from '@material-ui/core';
import Pagination from '@mui/material/Pagination';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './messageGrid.css';
import ConversationView from "../ConversationView/ConversationView";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import {MenuItem, Select} from "@mui/material";

const MessageGrid = () => {
  const [conversations, setConversations] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderDirection, setOrderDirection] = useState('DESC');

  const [viewOpen, setViewOpen] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);

  const itemsPerPage = 4;
  const fetchInterval = 2000;

  const fetchConversations = async (currentPage, orderDirection) => {
    try {
      const endpointURL = 'messages/getConversations';
      const response = await axiosPrivate.get(`${endpointURL}?pageNumber=${currentPage - 1}&pageSize=${itemsPerPage}&orderDirection=${orderDirection}`);

      setConversations(response.data.content);
      setTotalPages(response.data.totalPages);
    }
    catch (error) {
      console.log(error);
    }
  }

  const checkForNewMessages = () => {
    console.log("test");//
  }

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    fetchConversations(newPage, orderDirection);
  };

  const handleOpenConversation = (conversation) => {
    setCurrentConversation(conversation);
    setViewOpen(true);
  }

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

  const onClose = () => {
    setViewOpen(false);
    fetchConversations(currentPage, orderDirection);
  }

  useEffect(() => {
    fetchConversations(currentPage, orderDirection);

    const intervalId = setInterval(checkForNewMessages, fetchInterval);

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  return (
      <>
        Sort by:
        <Select
            id="order"
            value={orderDirection}
            onChange={(event) => {
              setOrderDirection(event.target.value);
              fetchConversations(currentPage, event.target.value)
            }}
        >
          <MenuItem value="DESC">Latest Messages First</MenuItem>
          <MenuItem value="ASC">Earliest Messages First</MenuItem>
        </Select>
        <br/>
        <br/>

        <Container maxWidth="lg">
          <div className='grid'>
            <Grid container spacing={2}>
              { conversations.length > 0 ? (conversations.map((conversation) => (
                  <Grid item xs={12} key={conversation.conversationID}>
                    {/* Display message as a clickable card */}
                    <Paper elevation={3} className="message-card" onClick={() => handleOpenConversation(conversation)}>
                      <Box display="flex" flexDirection="row" height="100%">
                        <Typography
                            variant="h6"
                            className={conversation.isRead ? 'read' : 'unread'}
                        >
                          {conversation.topic}
                        </Typography>
                        <Typography
                            className={conversation.isRead ? 'read' : 'unread'}
                        >
                          {conversation.member2Username}
                        </Typography>
                        <Typography
                            className={conversation.isRead ? 'read' : 'unread'}
                        >
                          {formatTimestamp(conversation.lastUpdated)}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
              ))) : <p style={{ textAlign: 'center' }}>No messages</p>

              }
            </Grid>

            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                className="pagination-container"
                showFirstButton
                showLastButton
            />
          </div>
        </Container>

        <Dialog open={viewOpen} onClose={onClose} maxWidth="md">
          <DialogTitle>{currentConversation?.topic || 'An error occured, check console for details'}</DialogTitle>
          <DialogContent>
            {
              currentConversation ? <ConversationView
                  conversationID={currentConversation.conversationID}
                  readonly={currentConversation.readonly}
                  onClose={onClose} /> : <></>
            }
          </DialogContent>
        </Dialog>
      </>
  );
};

export default MessageGrid;