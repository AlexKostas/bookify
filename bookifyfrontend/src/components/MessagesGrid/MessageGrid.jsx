import {useEffect, useState} from 'react';
import {Box, Container, Grid, Paper, Typography} from '@material-ui/core';
import Pagination from '@mui/material/Pagination';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './messageGrid.css';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

const messages = [
  { id: 1, sender: 'John Doe', subject: 'Greetings', content: 'Hello, how are you?' },
  { id: 1, sender: 'John Doe', subject: 'Greetings', content: 'Hello, how are you?' },
  { id: 1, sender: 'John Doe', subject: 'Greetings', content: 'Hello, how are you?' },
  { id: 1, sender: 'John Doe', subject: 'Greetings', content: 'Hello, how are you?' },
  { id: 1, sender: 'John Doe', subject: 'Greetings', content: 'Hello, how are you?' },
  { id: 1, sender: 'John Doe', subject: 'Greetings', content: 'Hello, how are you?' },
];

const MessageGrid = () => {
  const [conversations, setConversations] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderDirection, setOrderDirection] = useState('DESC');

  const itemsPerPage = 4;

  const fetchMessages = async (currentPage, orderDirection) => {
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

  const deleteConversation = async (conversationID) => {
    try{
        const endpointURL = `messages/delete/${conversationID}`;
        await axiosPrivate.delete(endpointURL);

        fetchMessages(currentPage, orderDirection);
    }
    catch (error){
        console.log(error);
    }
  }

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    fetchMessages(newPage, orderDirection);
  };

  const handleOpenConversation = (conversation) => {
    console.log(conversation);
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

  useEffect(() => {
    fetchMessages(currentPage, orderDirection);
  }, []);

  return (
      <Container maxWidth="lg">
        <div className='grid'>
          <Grid container spacing={2}>
            { conversations.length > 0 ? (conversations.map((conversation) => (
                <Grid item xs={12} key={conversation.conversationID}>
                  {/* Display message as a clickable card */}
                  <Paper elevation={3} className="message-card" onClick={() => handleOpenConversation(conversation)}>
                    <Box display="flex" flexDirection="row" height="100%">
                      <Typography variant="h6">{conversation.topic}</Typography>
                      <Typography>{conversation.member2Username}</Typography>
                      <Typography>{formatTimestamp(conversation.lastUpdated)}</Typography>
                      {/* <Typography variant="body2" className="message-preview">
                    {message.content.substring(0, 100)}{message.content.length > 100 ? '...' : ''}
                  </Typography> */}
                      <Tooltip title="Delete Conversation" placement="top">
                        <IconButton
                            aria-label="delete"
                            onClick={() => deleteConversation(conversation.conversationID)}
                            style={{ color: 'red' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
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
  );
};

export default MessageGrid;