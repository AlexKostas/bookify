// ChangePasswordPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import useAuth from '../hooks/useAuth';
import {Link, useNavigate} from "react-router-dom";
import {useLocalStorage} from "../hooks/useLocalStorage";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ChangePasswordForm from "../components/RegistrationForm/ChangePasswordForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";

const PASSWORD_UPDATE_URL = "/user/changePassword";

const ChangePasswordPage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { auth, setAuth } = useAuth();
    const { setItem } = useLocalStorage();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const handleChangePassword = async (userInfo) => {
        try {
            const response = await axiosPrivate.put(PASSWORD_UPDATE_URL,
                JSON.stringify(
                    {
                        username: auth.user,
                        oldPassword: userInfo.oldPwd,
                        newPassword: userInfo.pwd,
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
            if (err.response?.status === 400)
                errorMessage = 'New password can not be the same as old password';
            if (err.response?.status === 403)
                errorMessage = 'Old password is not correct';
            else
                errorMessage = 'Password change Failed'

            setError(errorMessage)
            console.log(err);
        }
    }

    return (
        <>
            <Navbar />
            <h1>Change Password</h1>
            <ChangePasswordForm onSubmit={handleChangePassword} errorMessage={error}/>
            <button onClick={() => navigate('/updateProfile')}>
                <FontAwesomeIcon icon={faEdit} />
                Back to Edit Profile
            </button>
        </>
    );
};

export default ChangePasswordPage;