// UpdateUserAboutPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import AboutInfoForm from "../components/AboutInfoForm/AboutInfoForm";
import OldAboutInfoForm from "../components/AboutInfoForm/OldAboutInfoForm";
import Footer from "../Footer/Footer";
import './styles/page.css';
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
            <div className="page-container">
                <Navbar />
                <div className="content">
                    <AboutInfoForm username={auth.user} onSubmit={submitUpdateRequest} errorMessage={error}
                                      success={success} />
                    <div className="page-button">
                        <Link to="/profile">
                            <Button
                                size="small"
                                variant="outlined"
                                sx = {{
                                    mt: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                }}
                            >
                                <ArrowBackIcon
                                    sx={{
                                        fontSize: '1.2rem',
                                        ml : "-7%",
                                    }}
                                />
                                Back to Profile
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
};

export default UpdateUserAboutPage;