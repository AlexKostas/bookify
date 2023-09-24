import React, {useEffect, useRef, useState} from "react";
import "./aboutInfoForm.css";
import useGetUserStats from "../../hooks/useGetUserStats";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const theme = createTheme();

const AboutInfoForm = ({   username='', initialAboutInfo = '', onSubmit,
                              errorMessage = '', success = false}) => {

    const [aboutInfo, setAboutInfo] = useState(initialAboutInfo);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userStats = {
            aboutInfo
        };
        onSubmit(userStats);
    };

    const userData = useGetUserStats(username);

    useEffect(() => {
        if (!userData) return;
        setAboutInfo(userData.aboutInfo);
    }, [userData]);


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
                        py: 1,
                        width: '150%',
                        marginLeft: '-25%',
                        marginRight: '-25%',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Edit About-Me Information
                    </Typography>
                    <br/>
                    <Typography
                        component="h5"
                        variant="h8"
                        align="center"
                        color="textSecondary"
                    >
                        Share a bit about yourself, your interests, and your hobbies. We'd love to get to know you better!
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <Grid item xs={12} >
                            <TextField
                                id="about-info"
                                multiline
                                autoFocus={true}
                                minRows={5}
                                maxRows={7}
                                value={aboutInfo}
                                label={"About Me"}
                                onChange={(event) => {
                                    setAboutInfo(event.target.value)
                                }}
                                inputProps={{ maxLength: 600 }}
                                sx={{ maxWidth: '36rem', }}
                                style={{ resize: 'none', width: '36rem' }}
                            />
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, width: "30%", mx: "auto"}}
                            endIcon={<FontAwesomeIcon icon={faEdit} />}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default AboutInfoForm;
