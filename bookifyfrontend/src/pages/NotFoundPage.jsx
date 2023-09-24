import { Link } from "react-router-dom"
import './styles/page.css';
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";

const NotFoundPage = () => {
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
                > Oops!
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: "1.4rem",
                            color: "#333",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                            mb: 4,
                        }}
                    > Page Not Found
                    </Typography>
                    <Link to="/">
                        <Button
                            size="small"
                            variant="outlined"
                            sx = {{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            Back to Home Page
                            <HomeIcon
                                sx={{
                                    ml: 0.5,
                                    fontSize: '1.3rem',
                                }}
                            />
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default NotFoundPage
