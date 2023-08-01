// ProfilePage.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
    const { auth } = useAuth();

  return (
    <>
        <Navbar />
        <RegistrationForm initialUsername={auth.user} showPassword={false} />
    </>
  );
};

export default ProfilePage;