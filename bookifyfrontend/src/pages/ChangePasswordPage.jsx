// ChangePasswordPage.jsx
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import "../components/RegistrationForm/registrationForm.css"
import {useNavigate} from "react-router-dom";
import ChangePasswordForm from "../components/RegistrationForm/ChangePasswordForm";
import Footer from "../Footer/Footer";


const ChangePasswordPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <ChangePasswordForm/>
            <button onClick={() => navigate('/updateProfile')}>
                <FontAwesomeIcon icon={faEdit} />
                Back to Edit Profile
            </button>
            <Footer/>
        </>
    );
};

export default ChangePasswordPage;