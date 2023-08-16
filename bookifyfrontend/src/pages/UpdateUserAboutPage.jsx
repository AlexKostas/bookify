// UpdateUserAboutPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import useAuth from '../hooks/useAuth';
import {useLocalStorage} from "../hooks/useLocalStorage";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faUnlock} from "@fortawesome/free-solid-svg-icons";
import AboutInfoForm from "../components/AboutInfoForm/AboutInfoForm";

const UPDATE_USER_ABOUT_URL = '/user/updateAboutInfo';

const UpdateUserAboutPage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { auth, setAuth } = useAuth();
    const { setItem } = useLocalStorage();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const submitUpdateRequest = async (userInfo) => {
        try {
            const response = await axiosPrivate.put(UPDATE_USER_ABOUT_URL,
                JSON.stringify(
                    {
                        username: auth.user,
                        aboutInfo: userInfo.aboutInfo
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
            else if (err.response?.status === 404)
                errorMessage = 'User not Found';
            else
                errorMessage = 'Update About Field Failed'

            setError(errorMessage)
            console.log(err);
        }
    }


    return (
        <>
            <Navbar />
            <h1>Update "About-Me Information"</h1>
            <div>
                <AboutInfoForm username={auth.user} onSubmit={submitUpdateRequest} errorMessage={error}
                                  success={success} />
                <button onClick={() => navigate('/profile')}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    Back to profile
                </button>
            </div>
        </>
    );
};

export default UpdateUserAboutPage;