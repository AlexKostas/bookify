import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const baseURL = "https://localhost:8443/api/registration/login";

const Login = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleShowPasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            username,
            password,
        };

        axios.post(baseURL, payload)
            .then((response) => {
                console.log('Login successful:', response.data);
            })
            .catch((error) => {
                console.error('Login error:', error);
            });
    };

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            style={{
                position: 'fixed',
                top: '64px',
                right: '16px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
            }}
        >
            <div>
                <TextField
                    id="outlined-error"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={handleUsernameChange}
                />
            </div>
            <div>
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleShowPasswordToggle}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        ),
                    }}
                />
            </div>
            <Button variant="contained" type="submit" onClick={handleSubmit}>
                Login
            </Button>
        </Box>
    );
};

export default Login;


