import UserGrid from '../components/UserGrid/UserGrid';
import Navbar from '../components/Navbar/Navbar';
import {useSearchContext} from "../context/SearchContext";
import React, {useEffect} from "react";
import Footer from "../components/Footer/Footer";
import './styles/page.css'

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
                    <h1>Admin Dashboard</h1>
                    <UserGrid />
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default AdminPage;