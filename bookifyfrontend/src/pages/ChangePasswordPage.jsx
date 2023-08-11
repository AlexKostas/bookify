// ChangePasswordPage.jsx
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import "../components/RegistrationForm/registrationForm.css"
import ChangePasswordForm from "../components/RegistrationForm/ChangePasswordForm";
import {useNavigate} from "react-router-dom";


const ChangePasswordPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <h1>Change Password</h1>
            <ChangePasswordForm/>
            <button onClick={() => navigate('/updateProfile')}>
                <FontAwesomeIcon icon={faEdit} />
                Back to Edit Profile
            </button>
        </>
    );
};

export default ChangePasswordPage;