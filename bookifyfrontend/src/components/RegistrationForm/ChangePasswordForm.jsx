// ChangePasswordForm.jsx
import React, {useEffect, useRef, useState} from 'react';
import useAuth from '../../hooks/useAuth';
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import "./registrationForm.css"
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import VpnKeyIcon from '@mui/icons-material/VpnKey';


const PASSWORD_UPDATE_URL = "/user/changePassword";
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const theme = createTheme();

const ChangePasswordForm = () => {
    const [error, setError] = useState('');
    const { auth, setAuth } = useAuth();
    const { setItem } = useLocalStorage();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const errRef = useRef();
    const isFirstRender = useRef(true);
    const [user] = useState();

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [showMatchPwd, setShowMatchPwd] = useState(false);

    const [oldPwd, setOldPwd] = useState('');
    const [showOldPwd, setShowOldPwd] = useState(false);

    const [pwdChanged, setPwdChanged] = useState(true);

    const validPwdChange =
                                oldPwd && pwd && matchPwd && pwdChanged &&
                                validPwd && validMatch;

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setPwdChanged(oldPwd !== pwd);
    }, [pwd, oldPwd])

    useEffect(() => {
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    const handleChangePassword = async (userInfo) => {
        try {
            const response = await axiosPrivate.put(PASSWORD_UPDATE_URL,
                JSON.stringify(
                    {
                        username: auth.user,
                        oldPassword: userInfo.oldPwd,
                        newPassword: userInfo.pwd,
                    }
                )
            );

            const responseUsername = response?.data?.username;
            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;
            const roles = response?.data?.roles;

            setAuth({ user: responseUsername, accessToken, refreshToken, roles });
            setItem('refreshToken', refreshToken);

            navigate('/profile');
        }
        catch(err) {
            let errorMessage = '';
            if (!err?.response)
                errorMessage = 'No Server Response';
            else if (err.response?.status === 400)
                errorMessage = 'New password can not be the same as old password';
            else if (err.response?.status === 403)
                errorMessage = 'Old password is not correct';
            else
                errorMessage = 'Password change Failed'
            setError(errorMessage)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const userDetails = {
            user,
            oldPwd,
            pwd
        };
        await handleChangePassword(userDetails);

        //Clear state
        setPwd('');
        setMatchPwd('');
        setOldPwd('');
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        mb: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: 6,
                        borderRadius: 2,
                        px: 4,
                        py: 6,
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Change Password <br/>
                        <VpnKeyIcon/>
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <p ref={errRef} className={error ? "errmsg" : "offscreen"} aria-live="assertive">{error}</p>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    autoFocus={true}
                                    fullWidth
                                    id="old_password"
                                    label="Old Password"
                                    type={showOldPwd ? "text" : "password"}
                                    value={oldPwd}
                                    onChange={(e) => {
                                        setOldPwd(e.target.value);
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowOldPwd(!showOldPwd)}
                                                    edge="end"
                                                >
                                                    {showOldPwd ? <VisibilityOff /> : <Visibility />}
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
                                    id="new_password"
                                    label="New Password"
                                    type={showPassword ? "text" : "password"}
                                    value={pwd}
                                    onChange={(e) => {
                                        setPwd(e.target.value);
                                        setValidPwd(PWD_REGEX.test(e.target.value));
                                    }}
                                    error={!validPwd || !pwdChanged}
                                    helperText={
                                        !pwdChanged ? (
                                            "New password must not be the same with the old password."
                                        ) : (
                                            !validPwd ? (
                                                <>
                                                    8 to 24 characters.<br />
                                                    Must include uppercase and lowercase letters, a number, and a special character.<br />
                                                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag"># </span>
                                                    <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                                </>
                                            ) : null
                                        )
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
                                    label="Confirm New Password"
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
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled = {!validPwdChange}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                            Edit Password
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default ChangePasswordForm;