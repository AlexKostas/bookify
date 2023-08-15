import Navbar from "../components/Navbar/Navbar";
import SearchBar from "../components/SearchBar/SearchBar";
import RoomGrid from "../components/RoomGrid/RoomGrid";
import {useSearchContext} from "../context/SearchContext";
import {useEffect, useState} from "react";
import axios from "../api/axios";

const HomePage = () => {
    const endpointURL = '/search/searchAll';
    const { resetSearch } = useSearchContext();
    const [rooms, setRooms] = useState([]);

    const fetchRooms = async () => {
        try{
            const response = await axios.get(`${endpointURL}?pageNumber=0&pageSize=9&orderDirection=ASC`);

            setRooms(response.data.content);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        resetSearch();
        fetchRooms()
    }, []);

    return (
        <>
        <Navbar />
        <SearchBar />
        <br />
        <h1>Rooms you may like</h1>
        <br />
        <RoomGrid rooms={rooms} />
        </>   
    )
}

export default HomePage