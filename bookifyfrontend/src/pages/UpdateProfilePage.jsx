// UpdateProfilePage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';
import useAuth from '../hooks/useAuth';
import {useLocalStorage} from "../hooks/useLocalStorage";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";

const UPDATE_URL = '/updateProfile';

const UpdateProfilePage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { auth, setAuth } = useAuth();
    const { setItem } = useLocalStorage();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const submitUpdateRequest = async (userInfo) => {
        try {
            const response = await axiosPrivate.post(UPDATE_URL,
                JSON.stringify(
                    {
                        oldUsername: userInfo.user,
                        newUsername: userInfo.username,
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        email : userInfo.email,
                        phoneNumber: userInfo.phoneNumber,
                        preferredRoles: userInfo.selectedRole
                    }
                )
            );

            const responseUsername = response?.data?.newUsername;
            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;
            const roles = response?.data?.roles;

            setAuth({ user: responseUsername, accessToken, refreshToken, roles });
            setItem('refreshToken', refreshToken);

            setSuccess(true);

            if(roles.includes('admin'))
                navigate('/admin');
            else if(roles.includes('host') || roles.includes('inactive-host'))
                navigate('/host');
            else
                navigate('/');
        }
        catch(err) {
            let errorMessage = '';
            if (!err?.response)
                errorMessage = 'No Server Response';
            else
                errorMessage = 'Update Failed'

            setError(errorMessage)
            console.log(err);
        }
    }


    return (
        <>
            <Navbar />
            <h1>Update Profile</h1>
            <RegistrationForm initialUsername={auth.user} showPassword={false} onSubmit={submitUpdateRequest} errorMessage={error}
                              success={success} inUpdate={true}/>
        </>
    );
};

export default UpdateProfilePage;