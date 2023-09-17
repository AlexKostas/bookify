import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar/Navbar';
import useAuth from '../hooks/useAuth';
import UserView from "../components/UserView/UserView";
import {Link, useNavigate} from "react-router-dom";
import {useSearchContext} from "../context/SearchContext";
import Footer from "../components/Footer/Footer";
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
                        mt: "1rem",
                        color: "#333",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                        textAlign: "center",
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