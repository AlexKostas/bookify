import UserGrid from '../components/UserGrid/UserGrid';
import Navbar from '../components/Navbar/Navbar';
import {useSearchContext} from "../context/SearchContext";
import React, {useEffect} from "react";
import Footer from "../Footer/Footer";

const AdminPage = () => {
    const { resetSearch } = useSearchContext();

    useEffect(() => {
        resetSearch();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Admin Dashboard</h1>
            <UserGrid />
            <Footer/>
        </div>
    );
}

export default AdminPage;