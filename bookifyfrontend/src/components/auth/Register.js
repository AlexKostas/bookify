import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const baseURL = "https://localhost:8443/api/registration/register";

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            username,
            password,
        };

        axios.post(baseURL, payload)
            .then((response) => {
                console.log('Registration successful:', response.data);
            })
            .catch((error) => {
                console.error('Registration error:', error);
            });
    };

    return (
        <div>
            <TextField
                id="outlined-username"
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={handleUsernameChange}
            />
            <TextField
                id="outlined-password"
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={handlePasswordChange}
            />
            <Button variant="contained" type="submit" onClick={handleSubmit}>
                Register
            </Button>
        </div>
    );
};

export default Registration;