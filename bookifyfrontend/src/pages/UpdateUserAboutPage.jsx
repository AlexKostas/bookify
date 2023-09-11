// UpdateUserAboutPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import AboutInfoForm from "../components/AboutInfoForm/AboutInfoForm";
import OldAboutInfoForm from "../components/AboutInfoForm/OldAboutInfoForm";
import Footer from "../Footer/Footer";

const UPDATE_USER_ABOUT_URL = '/user/updateAboutInfo';

const UpdateUserAboutPage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { auth, setAuth } = useAuth();
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
            <div>
                <AboutInfoForm username={auth.user} onSubmit={submitUpdateRequest} errorMessage={error}
                                  success={success} />
                <button onClick={() => navigate('/profile')}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    Back to profile
                </button>
            </div>
            <Footer/>
        </>
    );
};

export default UpdateUserAboutPage;