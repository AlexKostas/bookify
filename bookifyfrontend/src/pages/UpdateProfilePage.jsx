// UpdateProfilePage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';
import useAuth from '../hooks/useAuth';
import {useLocalStorage} from "../hooks/useLocalStorage";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faUnlock} from "@fortawesome/free-solid-svg-icons";

const UPDATE_URL = '/user/updateProfile';

const UpdateProfilePage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { auth, setAuth } = useAuth();
    const { setItem } = useLocalStorage();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

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

            const responseUsername = response?.data?.username;
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
            <RegistrationForm initialUsername={auth.user} inRegistration={false} onSubmit={submitUpdateRequest} errorMessage={error}
                              success={success} />
            <div>
            <button onClick={() => navigate('/profile')}>
                <FontAwesomeIcon icon={faChevronLeft} />
                Back to profile
            </button>

            <button onClick={() => navigate('/changePassword')}>
                <FontAwesomeIcon icon={faUnlock} />
                Change Password
            </button>
            </div>
        </>
    );
};

export default UpdateProfilePage;