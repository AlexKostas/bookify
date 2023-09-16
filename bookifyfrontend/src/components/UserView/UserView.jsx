import useImageFetcher from "../../hooks/useImageFetcher";
import { CircularProgress } from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import './userview.css';
import UserDetails from "../UserDetails/UserDetails";
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import EditIcon from '@mui/icons-material/Edit';
import {faEdit, faUnlock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import UserStats from "../UserStats/UserStats";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

const UserView = ({ username, onProfilePicChanged }) => {
    const profilePicURL = `/upload/getProfilePic/${username}`;
    const editProfilePicUrl = `/upload/uploadProfilePic/${username}`;

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();
    const clearError = () => setError(null);

    const { imageData, loading, setImageData } = useImageFetcher(profilePicURL);
    const [tabValue, setTabValue] = useState(0);

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const valid = (auth?.user === username);

    const inputRef = useRef(null)

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleImageChange = async (event) => {
        const selectedImage = event.target.files && event.target.files[0];
        event.target.value = null;
        if (!selectedImage) {
            return;
        }
        if (selectedImage) {
            const formData = new FormData();
            formData.append('file', selectedImage);

            try {
                const response = await  axiosPrivate.post(editProfilePicUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess("Profile picture updated successfully!");
                const data = URL.createObjectURL(selectedImage)
                setImageData(data);
                setError(null);
                setTimeout(() => {setSuccess(null)}, 5000);

                if(onProfilePicChanged) onProfilePicChanged(data);
            }
            catch(err) {
                console.log(err);
                if (!err?.response)
                    setError('No Server Response');
                else if (err.response?.status === 400)
                    setError('Only “jpg” and “png” image file formats are accepted');
                else if (err.response?.status === 500)
                    setError('Internal server error');
                else
                    setError('Edit profile picture Failed');

                setSuccess(null);
                setTimeout(clearError, 5000);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (imageData) {
                URL.revokeObjectURL(imageData);
            }
        };
    }, [imageData]);

    return (
    <>
        {success ? (
            <Alert severity="success" onClose={() => { setSuccess(null) }}>
                <AlertTitle>Success</AlertTitle>
                {success}
            </Alert>
        ) : error && (
            <Alert severity="error" onClose={clearError}>
                <AlertTitle>Error</AlertTitle>
                {error}
            </Alert>
        )}
        <div className='profile-container'>
            {loading ? (
            <div className='loading-container'>
                <CircularProgress size={80} className='circular-progress' />
                <h3>Loading profile picture...</h3>
            </div>
            ) : imageData ? (
                <div className='profile-picture-container'>
                    <button onClick={handleClick}
                            className={"button"}
                            disabled = {!valid}
                    >
                        <div className="image-container">
                            <img
                                className={`profile-pic ${valid && 'profile-pic-hover'}`}
                                src={imageData}
                                alt="Could not load profile picture"
                            />
                            {
                                valid && (
                                    <div className="overlay">
                                        <span><FontAwesomeIcon icon={faEdit}/></span>
                                    </div>
                                )
                            }
                        </div>

                        {
                            valid && (
                                <div className="edit-icon">
                                    <EditIcon />
                                </div>
                            )
                        }

                        <input
                            style={{display: 'none'}}
                            ref={inputRef}
                            type="file"
                            accept=".png, .jpg"
                            onChange={handleImageChange}
                        />
                    </button>
                </div>
            ) : (
            <p>Could not load profile picture</p>
            )}
            <h2 className="username-label">{username}</h2>
            <div className="tabs-container">
                <Tabs
                    value={tabValue}
                    onChange={(event, newValue) => setTabValue(newValue)}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="User Info" />
                    <Tab label="User Stats" />
                </Tabs>
                {tabValue === 0 && <UserDetails username={username} />}
                {tabValue === 1 && <UserStats username={username}/>}
                {valid && (
                    <div className="edit-buttons">
                        <Grid container spacing={1} justify="center" className="custom-grid">
                            <Grid item xs={4}>
                                <Button
                                    onClick={() => navigate('/updateProfile')}
                                    variant="outlined"
                                    size = "small"
                                    fullWidth
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                    Edit Profile
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    onClick={() => navigate('/updateAboutInfo')}
                                    variant="outlined"
                                    size = "small"
                                    fullWidth
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                    Edit About-Me Info
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    onClick={() => navigate('/changePassword')}
                                    variant="outlined"
                                    size = "small"
                                    fullWidth
                                >
                                    <FontAwesomeIcon icon={faUnlock} />
                                    Change Password
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                )}
            </div>
        </div>
    </>
    );
}

export default UserView;