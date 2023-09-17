import UserGrid from '../components/UserGrid/UserGrid';
import Navbar from '../components/Navbar/Navbar';
import {useSearchContext} from "../context/SearchContext";
import React, {useEffect} from "react";
import Footer from "../Footer/Footer";
import './styles/page.css'
import Typography from "@mui/material/Typography";

const AdminPage = () => {
    const { resetSearch } = useSearchContext();

    useEffect(() => {
        resetSearch();
    }, []);

    return (
        <div>
            <div className="page-container">
                <Navbar />
                <div className="content">
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: "2.1rem",
                            padding: "1rem",
                            color: "#333",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                            textAlign: "center",
                        }}
                    >
                        Admin Dashboard
                    </Typography>
                    <UserGrid />
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default AdminPage;