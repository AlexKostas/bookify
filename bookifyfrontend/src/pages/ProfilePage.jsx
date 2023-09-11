import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar/Navbar';
import useAuth from '../hooks/useAuth';
import UserView from "../components/UserView/UserView";
import {Link, useNavigate} from "react-router-dom";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSearchContext} from "../context/SearchContext";
import Footer from "../Footer/Footer";

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
        <Navbar image={profilePic} />
        <h1>Profile</h1>
        <UserView username={auth.user} onProfilePicChanged={(image) => setProfilePic(image)}/>
        <button onClick={() => navigate('/updateProfile')}>
            <FontAwesomeIcon icon={faEdit} />
            Edit Profile
        </button>
        <button onClick={() => navigate('/updateAboutInfo')}>
            <FontAwesomeIcon icon={faEdit} />
            Edit About Info
        </button>
        <Footer/>
    </>
  );
};

export default ProfilePage;