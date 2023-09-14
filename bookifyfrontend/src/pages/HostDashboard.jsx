import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar/Navbar";
import RoomDashboard from "../components/RoomDashboard/RoomDashboard";
import {useSearchContext} from "../context/SearchContext";
import React, {useEffect} from "react";
import Footer from "../Footer/Footer";
import './styles/page.css';

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
                            <h3>You have not currently been given host permissions. Please contact an admin for help</h3>
                            :(
                                <>
                                    <h1>Host Dashboard</h1>
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