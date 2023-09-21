import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar/Navbar";
import RoomDashboard from "../components/RoomDashboard/RoomDashboard";
import {useSearchContext} from "../context/SearchContext";
import React, {useEffect} from "react";
import Footer from "../components/Footer/Footer";
import './styles/page.css';
import Typography from "@mui/material/Typography";
import HomeIcon from '@mui/icons-material/Home';
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

const HostDashboard = () => {
    const { auth } = useAuth();
    const isInactiveHost = auth.roles.includes('inactive-host');
    const { resetSearch } = useSearchContext();

    useEffect(() => {
        resetSearch();
    }, []);

    return (
        <div>
            <div className="page-container">
                <Navbar />
                <div className="content">
                    {
                        isInactiveHost ?
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontSize: "1.5rem",
                                        color: "#333",
                                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                                        textAlign: "center",
                                        mt: 4,
                                    }}
                                >
                                    You have not currently been given host permissions. Please contact an admin for help.
                                </Typography>
                                <Link to="/">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        sx = {{
                                            mt: 2,
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
                            :(
                                <>
                                    <h1>Host Dashboard</h1>
                                    <br/>
                                    <RoomDashboard />
                                </>
                                )
                    }
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default HostDashboard;