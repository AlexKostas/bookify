import { Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './userstats.css';
import axios from "../../api/axios";

const UserStats = ({ username }) => {
    const [user, setUser] = useState(null)

    const fetchUserStats = async () => {
        if (username === '') {
            setUser(null);
            return;
        }

        try {
            const response = await axios.get(`/user/getUserStats/${username}`);

            setUser(response?.data ?? null);

        } catch (error) {
            console.log(error);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUserStats();
    }, [username]);

    return (
        <div className="user-stats">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="body1">About Me: {user?.aboutInfo}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1">Date of registration: {user?.memberSince}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1">Total number of reviews: {user?.nReviews}</Typography>
                </Grid>
            </Grid>
        </div>
    );
}

export default UserStats;