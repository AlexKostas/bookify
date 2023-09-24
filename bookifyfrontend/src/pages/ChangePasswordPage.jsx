// ChangePasswordPage.jsx
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import "../components/RegistrationForm/registrationForm.css"
import {Link, useNavigate} from "react-router-dom";
import ChangePasswordForm from "../components/RegistrationForm/ChangePasswordForm";
import Footer from "../components/Footer/Footer";
import './styles/page.css'
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const ChangePasswordPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="page-container">
                <Navbar />
                <div className="content">
                    <ChangePasswordForm/>
                    <div className="page-button">
                        <Link to="/profile">
                            <Button
                                size="small"
                                variant="outlined"
                                sx = {{
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

export default ChangePasswordPage;