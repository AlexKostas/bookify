import Navbar from "../components/Navbar/Navbar"
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import CreateRoom from "../components/CreateRoom/CreateRoom";
import Footer from "../Footer/Footer";
import './styles/page.css';

const CreateRoomPage = () => {
    const location = useLocation();
    const [roomID, setRoomID] = useState(null);

    useEffect(() => {
        if(location) setRoomID(location.state);
    }, [location]);

    return (
        <>
            <div className="page-container">
                <Navbar />
                <div className="content">
                    <CreateRoom roomID={roomID} />
                </div>
                <Footer/>
            </div>
        </>
    )
}

export default CreateRoomPage;