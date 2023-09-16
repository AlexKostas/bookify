// ChangePasswordPage.jsx
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import "../components/RegistrationForm/registrationForm.css"
import {useNavigate} from "react-router-dom";
import ChangePasswordForm from "../components/RegistrationForm/ChangePasswordForm";
import Footer from "../components/Footer/Footer";
import './styles/page.css'


const ChangePasswordPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="page-container">
                <Navbar />
                <div className="content">
                    <ChangePasswordForm/>
                    <button onClick={() => navigate('/updateProfile')}>
                        <FontAwesomeIcon icon={faEdit} />
                        Back to Edit Profile
                    </button>
                </div>
                <Footer/>
            </div>
        </>
    );
};

export default ChangePasswordPage;