import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar/Navbar';
import useAuth from '../hooks/useAuth';
import UserView from "../components/UserView/UserView";
import {Link, useNavigate} from "react-router-dom";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSearchContext} from "../context/SearchContext";

const ProfilePage = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { resetSearch } = useSearchContext();

    useEffect(() => {
        resetSearch();
    }, []);

  return (
    <>
        <Navbar />
        <h1>Profile</h1>
        <UserView username={auth.user}/>
        <button onClick={() => navigate('/updateProfile')}>
            <FontAwesomeIcon icon={faEdit} />
            Edit Profile
        </button>
        <button onClick={() => navigate('/updateAboutInfo')}>
            <FontAwesomeIcon icon={faEdit} />
            Edit About Info
        </button>
    </>
  );
};

export default ProfilePage;