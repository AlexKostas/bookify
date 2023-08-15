import Navbar from "../components/Navbar/Navbar";
import SearchBar from "../components/SearchBar/SearchBar";
import RoomGrid from "../components/RoomGrid/RoomGrid";

const HomePage = () => {
    const endpointURL = '/search/searchAll';

    return (
        <>
        <Navbar />
        <SearchBar />
        <br />
        <h1>Rooms you may like</h1>
        <br />
        <RoomGrid endpointURL={endpointURL} />
        </>   
    )
}

export default HomePage