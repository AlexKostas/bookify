import { useParams } from "react-router-dom"
import UserView from "../components/UserView/UserView"
import Navbar from "../components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import React from "react";
import './styles/page.css';

const ViewUserPage = () => {
    const { username } = useParams();

    return (
        <>
            <div className="page-container">
                <Navbar />
                <div className="content">
                    <UserView username={username} />
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default ViewUserPage;