// ProfilePage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import useAuth from '../hooks/useAuth';
import UserView from "../components/UserView/UserView";
import {Link, useNavigate} from "react-router-dom";

const ProfilePage = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

  return (
    <>
        <Navbar />
        <h1>Profile</h1>
        <UserView username={auth.user}/>
        <button onClick={() => navigate('/updateProfile')}>Edit Profile</button>
    </>
  );
};

export default ProfilePage;