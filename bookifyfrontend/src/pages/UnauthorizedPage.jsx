import { useNavigate } from "react-router-dom"
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import './styles/page.css';
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className="page-container">
            <Navbar />
            <div className="content">
                <Typography
                    variant="h1"
                    sx={{
                        padding: "2rem",
                        fontSize: "2.1rem",
                        color: "#333",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                        mb: 4,
                    }}
                > Unauthorized
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: "1.3rem",
                            color: "#333",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                            mb: 4,
                        }}
                    > You do not have access to the requested page.
                    </Typography>
                    <Button
                        onClick={goBack}
                        size="small"
                        variant="outlined"
                    >
                        <ArrowBackIcon
                            sx={{
                                fontSize: '1.2rem',
                                ml : "-7%",
                            }}
                        />
                        Go Back
                    </Button>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default UnauthorizedPage;