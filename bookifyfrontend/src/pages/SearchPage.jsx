import {useSearchContext} from "../context/SearchContext";
import Navbar from "../components/Navbar/Navbar";
import RoomGrid from "../components/RoomGrid/RoomGrid";
import FilterPanel from "../components/FilterPanel/FilterPanel";
import {useEffect} from "react";

const SearchPage = () => {
    const { searchInfo } = useSearchContext();

    useEffect(() => {
        console.log(searchInfo);
    }, []);

    return (
        <>
            <Navbar />
            {
                searchInfo ? (
                    <>
                        <h1>Search Results</h1>
                        <FilterPanel />
                        <RoomGrid endpointURL={'/search/searchAll'} />
                    </>
                ) : (
                    <h3>No search parameters provided</h3>
                )
            }
        </>
    );
}

export default SearchPage;