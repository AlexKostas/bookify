import Navbar from "../components/Navbar/Navbar";
import SearchBar from "../components/SearchBar/SearchBar";
import RoomGrid from "../components/RoomGrid/RoomGrid";
import SearchField from "../components/SearchField/SearchField";

const HomePage = () => {
    const endpointURL = '/search/searchAll';

    return (
        <>
        <Navbar />
        <SearchField />
        <SearchBar />
        <br />
        <h1>Rooms you may like</h1>
        <br />
        <RoomGrid endpointURL={endpointURL} />
        </>   
    )
}

export default HomePage