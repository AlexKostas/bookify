import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar/Navbar';
import useAuth from '../hooks/useAuth';
import UserView from "../components/UserView/UserView";
import {Link, useNavigate} from "react-router-dom";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSearchContext} from "../context/SearchContext";
import Footer from "../Footer/Footer";
import './styles/page.css';
import Typography from "@mui/material/Typography";

const ProfilePage = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { resetSearch } = useSearchContext();
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        resetSearch();
    }, []);

  return (
    <>
        <div className="page-container">
            <Navbar image={profilePic} />
            <div>
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: "2.1rem",
                        mt: "1rem"
                    }}
                >
                    User Profile
                </Typography>
            </div>
            <div className="content">
                <UserView username={auth.user} onProfilePicChanged={(image) => setProfilePic(image)}/>
            </div>
            <Footer/>
        </div>
    </>
  );
};

export default ProfilePage;