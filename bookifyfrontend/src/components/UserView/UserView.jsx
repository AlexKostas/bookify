import useImageFetcher from "../../hooks/useImageFetcher";
import { CircularProgress } from "@mui/material";
import {useRef, useState} from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import './userview.css';
import UserDetails from "../UserDetails/UserDetails";
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const UserView = ({ username }) => {
    const profilePicURL = `/upload/getProfilePic/${username}`;
    const editProfilePicUrl = `/upload/uploadProfilePic/${username}`;

    const [error, setError] = useState('');
    const {imageData, loading} = useImageFetcher(profilePicURL);
    const [tabValue, setTabValue] = useState(0);
    const [profileImage, setProfileImage] = useState('default-profile-image.jpg');

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const valid = (auth.user === username);

    const inputRef = useRef(null)

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleImageChange = (event) => {
        const selectedImage = event.target.files && event.target.files[0];
        event.target.value = null;
        if (!selectedImage) {
            return;
        }
        if (selectedImage) {
            const formData = new FormData();
            formData.append('file', selectedImage);
            const imageURL = URL.createObjectURL(selectedImage);
            setProfileImage(imageURL);

            try {
                const response = axiosPrivate.post(editProfilePicUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            catch(err) {
                let errorMessage = '';
                if (!err?.response)
                    errorMessage = 'No Server Response';
                else if (err.response?.status === 400)
                    errorMessage = 'Illegal argument';
                else if (err.response?.status === 500)
                    errorMessage = 'Internal server error';
                else
                    errorMessage = 'Edit profile picture Failed'

                setError(errorMessage)
                console.log(err);
            }
            // URL.revokeObjectURL(imageURL)
        }
    };

    return (
    <>    
        <div className='container'>
            {loading ? (
            <div className='loading-container'>
                <CircularProgress size={80} className='circular-progress' />
                <h3>Loading profile picture...</h3>
            </div>
            ) : imageData ? (
            <div className='profile-picture-container'>
                <img onClick = {handleClick}
                    className="profile-pic"
                    src={imageData}
                    alt="Could not load profile picture"
                />
                <input
                    style={{display: 'none'}}
                    ref={inputRef}
                    type="file"
                    onChange={handleImageChange}
                />

                <button onClick={handleClick}>Open file upload box</button>
            </div>
            ) : (
            <p>Could not load profile picture</p>
            )}
            <h2>{username}</h2>
        </div>

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
          {tabValue === 1 && <h1>User Stats</h1>}
    </>
    );
}

export default UserView;