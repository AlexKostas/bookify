import { useState, useEffect } from 'react';
import { Grid, Typography, Paper } from '@material-ui/core';
import { Container, Box } from '@material-ui/core';
import Pagination from '@mui/material/Pagination';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './messageGrid.css';

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
  const [orderDirection, setOrderDirection] = useState('ASC');

  const itemsPerPage = 4;

  const fetchMessages = async (currentPage, orderDirection) => {
    try {
      const endpointURL = 'messages/getConversations'
      const response = await axiosPrivate.get(`${endpointURL}?pageNumber=${currentPage - 1}&pageSize=${itemsPerPage}&orderDirection=${orderDirection}`);

      setConversations(response.data.content);
      setTotalPages(response.data.totalPages);
    }
    catch (error) {
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
    const formattedDate = new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });

    return formattedDate;
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