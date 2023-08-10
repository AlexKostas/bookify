// UpdateProfilePage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';
import useAuth from '../hooks/useAuth';
import {useLocalStorage} from "../hooks/useLocalStorage";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";

const UPDATE_URL = '/user/updateProfile';

const UpdateProfilePage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { auth, setAuth } = useAuth();
    const [userName, setUserName] = useState(auth.user);
    const { setItem } = useLocalStorage();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    console.log(userName);
    const submitUpdateRequest = async (userInfo) => {
        try {
            const response = await axiosPrivate.put(UPDATE_URL,
                JSON.stringify(
                    {
                        oldUsername: auth.user,
                        newUsername: userInfo.user,
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        email : userInfo.email,
                        phoneNumber: userInfo.phoneNumber,
                        preferredRoles: userInfo.selectedRole
                    }
                )
            );
            console.log(userName);
            console.log(userInfo.username);
            const responseUsername = response?.data?.newUsername;
            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;
            const roles = response?.data?.roles;

            setAuth({ user: responseUsername, accessToken, refreshToken, roles });
            setItem('refreshToken', refreshToken);

            setSuccess(true);
            navigate('/profile');
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