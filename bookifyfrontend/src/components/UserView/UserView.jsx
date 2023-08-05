import useImageFetcher from "../../hooks/useImageFetcher";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import './userview.css';
import UserDetails from "../UserDetails/UserDetails";

const UserView = ({ username }) => {
    const profilePicURL = `/upload/getProfilePic/${username}`;
    const {imageData, loading} = useImageFetcher(profilePicURL);
    const [tabValue, setTabValue] = useState(0);

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
                <img
                        src={imageData}
                        alt="Could not load profile picture"
                    />
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