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
import Badge from "../Badge/Badge";
import useAutoFetchMessages from "../../hooks/useAutoFetchMessages";
import CustomDialogTitle from "../ComposeMessage/CustomDialogTitle";

const MessageGrid = ({ orderDirection }) => {
  const [conversations, setConversations] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [viewOpen, setViewOpen] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);

  const unreadMessages = useAutoFetchMessages();

  const itemsPerPage = 4;

  const errTopic = 'An error occurred, check console for details';

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
    if(unreadMessages > 0) fetchConversations(currentPage, orderDirection);
  }, [unreadMessages]);

  useEffect(() => {
    fetchConversations(currentPage, orderDirection);
  }, [orderDirection]);

  return (
      <>
        <br/>
        <br/>

        <Container maxWidth="lg">
          <div className='grid'>
            <Grid container spacing={2}>
              { conversations.length > 0 ? (conversations.map((conversation) => (
                  <Grid item xs={12} key={conversation.conversationID}>
                    <Paper elevation={3} className="message-card" onClick={() => handleOpenConversation(conversation)}>
                      <Box display="flex" flexDirection="row" height="100%">

                        <div className="message-username-label card-section">
                          <span>{conversation.member2Username}</span>
                        </div>

                        <div className="message-topic-label card-section">
                          <span>{conversation.topic}</span>
                        </div>

                        <div
                            className={`message-timestamp-label card-section ${!conversation.isRead && 'message-timestamp-label-read'}`}
                        >
                          <span>{formatTimestamp(conversation.lastUpdated)}</span>
                        </div>

                        {
                          !conversation.isRead &&
                            <div className="message-status-container card-section">
                              <Badge bg="secondary">New</Badge>
                            </div>
                        }



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
          <DialogTitle sx={{ backgroundColor: '#003580', color: 'white' }}>
            <CustomDialogTitle title={currentConversation?.topic || <span style={{ color: 'rgb(220,40,30)' }}>{errTopic}</span>}/>
          </DialogTitle>
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