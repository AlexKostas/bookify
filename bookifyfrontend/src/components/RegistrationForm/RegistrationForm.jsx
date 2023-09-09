// RegistrationForm.jsx
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {Link} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useGetUserDetails from "../../hooks/useGetUserDetails";
import {useEffect, useRef, useState} from "react";
import {FormControl, InputAdornment, InputLabel, MenuItem, Select} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const NAME_REGEX = /^[A-Za-z]{2,24}$/;
const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@(.+)$/;
const PHONE_REGEX = /^\d{10,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{4,24}$/;

const theme = createTheme();

const RegistrationForm = ({
                                 inRegistration = true,
                                 initialUsername = '',
                                 onSubmit, errorMessage = '',
                                 success = false
}) => {

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(true);

    const [firstName, setFirstName] = useState('');
    const [validFirstName, setValidFirstName] = useState(true);

    const [lastName, setLastName] = useState('');
    const [validLastName, setValidLastName] = useState(true);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(true);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [validPhone, setValidPhone] = useState(true);

    const [selectedRole, setSelectedRole] = useState('tenant');

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(true);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(true);

    const userData = useGetUserDetails(initialUsername);

    const [showPassword, setShowPassword] = useState(false);
    const [showMatchPwd, setShowMatchPwd] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    const validSignUp = user && firstName && lastName && email && phoneNumber && pwd && matchPwd &&
                            validName && validFirstName && validLastName && validEmail && validPhone &&
                            validPwd && validMatch;

    const validEdit = user && firstName && lastName && email && phoneNumber &&
                          validName && validFirstName && validLastName && validEmail && validPhone;

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        if (!userData) return;

        setUser(userData.username);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setPhoneNumber(userData.phoneNumber);
        setSelectedRole(userData.rolePreference);
    }, [userData]);

    useEffect(() => {
        setValidMatch(pwd === matchPwd);
    }, [matchPwd, pwd])

    useEffect(() => {
        setErrMsg(errorMessage);
        errRef.current.focus();
    }, [errorMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userDetails = {
            user,
            pwd,
            firstName,
            lastName,
            email,
            phoneNumber,
            selectedRole,
        };
        onSubmit(userDetails);

        setPwd('');
        setMatchPwd('');
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You have registered successfully!</h1>
                    <p>
                        <Link to="/">Go to home page</Link>
                    </p>
                </section>
            ) : (
                <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="sm">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 4,
                                mb: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxShadow: 6,
                                borderRadius: 2,
                                px: 4,
                                py: 1,
                            }}
                        >
                            {inRegistration ? (
                                <>
                                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                        <LockOutlinedIcon />
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        Sign up
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Typography component="h1" variant="h5">
                                        Edit Profile
                                    </Typography>
                                </>
                            )}
                            <Box
                                component="form"
                                noValidate
                                onSubmit={handleSubmit}
                                sx={{ mt: 3 }}
                            >
                                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
                                        <TextField
                                            required
                                            fullWidth
                                            id="userName"
                                            label="Username"
                                            name="username"
                                            autoComplete="off"
                                            value={user}
                                            onChange={(e) => {
                                                setUser(e.target.value);
                                                setValidName(USER_REGEX.test(e.target.value));
                                            }}
                                            error={!validName}
                                            helperText={
                                                !validName ? (
                                                    <>
                                                        Username must contain 4 to 24 characters. <br/>
                                                        Must begin with a letter. <br />
                                                        Letters, numbers, underscores, hyphens allowed.
                                                    </>
                                                ) : null
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <TextField
                                            type="text"
                                            id="firstname"
                                            ref={userRef}
                                            autoComplete="off"
                                            value={firstName}
                                            required
                                            fullWidth
                                            label="First Name"
                                            onChange={(e) => {
                                                setFirstName(e.target.value);
                                                setValidFirstName(NAME_REGEX.test(e.target.value));
                                            }}
                                            error={!validFirstName}
                                            helperText={
                                                !validFirstName ? (
                                                    <>
                                                        First name must contain 2 to 25 characters. <br/>
                                                        Only letters are allowed. <br />
                                                    </>
                                                ) : null
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            type="text"
                                            id="lastname"
                                            ref={userRef}
                                            autoComplete="off"
                                            value={lastName}
                                            required
                                            fullWidth
                                            label="Last Name"
                                            onChange={(e) => {
                                                setLastName(e.target.value);
                                                setValidLastName(NAME_REGEX.test(e.target.value));
                                            }}
                                            error={!validLastName}
                                            helperText={
                                                !validLastName ? (
                                                    <>
                                                        Last name must contain 2 to 25 characters. <br/>
                                                        Only letters are allowed. <br />
                                                    </>
                                                ) : null
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setValidEmail(EMAIL_REGEX.test(e.target.value));
                                            }}
                                            error={!validEmail}
                                            helperText={
                                                !validEmail ? (
                                                    <>
                                                        Only allowed characters before the @ symbol are: <br/>
                                                        Alphanumeric characters, plus symbols (+), underscores (_), dots (.), and hyphens (-).
                                                    </>
                                                ) : null
                                            }
                                        />
                                    </Grid>
                                    {inRegistration && (
                                        <>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="password"
                                                    label="Password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={pwd}
                                                    onChange={(e) => {
                                                        setPwd(e.target.value);
                                                        setValidPwd(PWD_REGEX.test(e.target.value));
                                                    }}
                                                    error={!validPwd}
                                                    helperText={
                                                        !validPwd ? (
                                                            <>
                                                                8 to 24 characters.<br />
                                                                Must include uppercase and lowercase letters, a number and a special character.<br />
                                                                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag"># </span>
                                                                <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                                            </>
                                                        ) : null
                                                    }
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    edge="end"
                                                                >
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                        sx: { height: '3rem' },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="matchPwd"
                                                    label="Confirm Password"
                                                    type={showMatchPwd ? "text" : "password"}
                                                    value={matchPwd}
                                                    error={!validMatch}
                                                    onChange={(e) => {
                                                        setMatchPwd(e.target.value);
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => setShowMatchPwd(!showMatchPwd)}
                                                                    edge="end"
                                                                >
                                                                    {showMatchPwd ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                        sx: { height: '3rem' },
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item xs={12}>
                                        <TextField
                                            name="phonenumber"
                                            required
                                            fullWidth
                                            label="Phone Number"
                                            type="text"
                                            id="phonenumber"
                                            ref={userRef}
                                            autoComplete="off"
                                            onChange={(e) => {
                                                setPhoneNumber(e.target.value);
                                                setValidPhone(PHONE_REGEX.test(e.target.value));
                                            }}
                                            value={phoneNumber}
                                            error={!validPhone}
                                            helperText={
                                                !validPhone ? (
                                                    <>
                                                        At least 10 digits are required.
                                                    </>
                                                ) : null
                                            }
                                        />
                                    </Grid>
                                    {
                                        userData?.rolePreference !== 'admin' && (
                                            <>
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="select-label">Select Role</InputLabel>
                                                        <Select
                                                            labelId="select-label"
                                                            id="dropdown"
                                                            value={selectedRole}
                                                            label="Select role"
                                                            onChange={(event) => setSelectedRole(event.target.value)}>
                                                        >
                                                            <MenuItem value="tenant">Tenant</MenuItem>
                                                            <MenuItem value="host">Host</MenuItem>
                                                            <MenuItem value="host_tenant">Host & Tenant</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )
                                    }
                                </Grid>
                                {inRegistration ? (
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled = {!validSignUp}
                                    >
                                        Sign Up
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled = {!validEdit}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                        Edit
                                    </Button>
                                )}
                                {inRegistration && (
                                    <Grid container justifyContent="flex-end" >
                                        <Grid item>
                                            <Link to="/login" variant="body2" style={{ color: 'blue'}} >
                                                Already have an account? Sign in
                                            </Link>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            )}
        </>
    );
}

export default RegistrationForm;