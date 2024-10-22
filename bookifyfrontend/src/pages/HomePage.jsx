import Navbar from "../components/Navbar/Navbar";
import SearchBar from "../components/SearchBar/SearchBar";
import RoomGrid from "../components/RoomGrid/RoomGrid";
import {useEffect, useState} from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Footer from "../components/Footer/Footer";
import './styles/page.css';
import Typography from "@mui/material/Typography";

const HomePage = () => {
    const endpointURL = '/recommendation/recommend';
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const fetchRooms = async () => {
        try{
            setLoading(true)
            const response = (auth && auth.user) ? await axiosPrivate.get(endpointURL) : await axios.get(endpointURL);

            setRooms(response.data);
        }
        catch(error){
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRooms()
    }, []);

    return (
        <>
            <div className="page-container">
                <Navbar />
                <div className="content">
                    <SearchBar />
                    <br />
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: "2.1rem",
                            color: "#333",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        {(auth && auth.user) ? 'Rooms you may like' : 'Top rated'}
                    </Typography>
                    <br />
                    <RoomGrid rooms={rooms} loading={loading} />
                </div>
                <Footer/>
            </div>
        </>   
    )
}

export default HomePage