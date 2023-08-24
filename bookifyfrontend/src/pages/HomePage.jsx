import Navbar from "../components/Navbar/Navbar";
import SearchBar from "../components/SearchBar/SearchBar";
import RoomGrid from "../components/RoomGrid/RoomGrid";
import {useEffect, useState} from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const HomePage = () => {
    const endpointURL = '/recommendation/recommend';
    const [rooms, setRooms] = useState([]);

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const fetchRooms = async () => {
        try{
            const response = (auth && auth.user) ? await axiosPrivate.get(endpointURL) : await axios.get(endpointURL);

            setRooms(response.data);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchRooms()
    }, []);

    return (
        <>
        <Navbar />
        <SearchBar />
        <br />
        <h1>{(auth && auth.user) ? 'Rooms you may like' : 'Top rated'}</h1>
        <br />
        <RoomGrid rooms={rooms} />
        </>   
    )
}

export default HomePage