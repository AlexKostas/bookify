import { useParams } from "react-router-dom"
import UserView from "../components/UserView/UserView"
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import React from "react";
import './styles/page.css';
import Typography from "@mui/material/Typography";

const ViewUserPage = () => {
    const { username } = useParams();

    return (
        <>
            <div className="page-container">
                <Navbar />
                <div className="content">
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: "2.1rem",
                            mt: "1rem",
                            color: "#333",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                            textAlign: "center",
                        }}
                    >
                        {username}'s Profile
                    </Typography>
                    <UserView username={username} />
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default ViewUserPage;