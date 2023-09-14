import { Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './userdetails.css';
import axios from "../../api/axios";

const UserDetails = ({ username }) => {
    const [user, setUser] = useState(null)

    const fetchUserDetails = async () => {
      if (username === '') {
        setUser(null);
        return;
      }

      try {
        const response = await axios.get(`/user/getUser/${username}`);

        setUser(response?.data ?? null);

      } catch (error) {
        console.log(error);
        setUser(null);
      }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [username]);

    return (
        <div className="user-info">
            <Grid container spacing={2}>
                <Grid item xs={6}>
                <Typography variant="body1">First Name: {user?.firstName}</Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="body1">Last Name: {user?.lastName}</Typography>
                </Grid>
                <Grid item xs={12}>
                <Typography variant="body1">Email: {user?.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                <Typography variant="body1">Phone Number: {user?.phoneNumber}</Typography>
                </Grid>
            </Grid>
        </div>
  );
}

export default UserDetails;