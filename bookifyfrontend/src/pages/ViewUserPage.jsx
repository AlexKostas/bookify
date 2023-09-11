import { useParams } from "react-router-dom"
import UserView from "../components/UserView/UserView"
import Navbar from "../components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import React from "react";

const ViewUserPage = () => {
    const { username } = useParams();

    return (
        <>
            <Navbar />
            <UserView username={username} />
            <Footer/>
        </>
    );
}

export default ViewUserPage;