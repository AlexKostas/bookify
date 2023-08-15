import {useSearchContext} from "../context/SearchContext";
import Navbar from "../components/Navbar/Navbar";
import RoomGrid from "../components/RoomGrid/RoomGrid";
import {useEffect, useState} from "react";
import FiltersPanel from "../components/FiltersPanel/FiltersPanel";
import './styles/searchPage.css'
import axios from "../api/axios";
import {Pagination} from "@mui/material";

const SearchPage = () => {
    const { searchInfo } = useSearchContext();
    const itemsPerPage = 9;
    const [rooms, setRooms] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderDirection, setOrderDirection] = useState('ASC');

    const fetchRooms = async (currentPage) => {
        const endpointURL = '/search/searchAll';
        try{
            const response = await axios.get(`${endpointURL}?pageNumber=${currentPage-1}&pageSize=${itemsPerPage}&orderDirection=${orderDirection}`);

            setRooms(response.data.content);
            setTotalPages(response.data.totalPages);
        }
        catch(error){
            console.log(error);
        }
    }

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        fetchRooms(newPage);
    }

    const onOptionsChanged = (newOptions) => {
        console.log(newOptions);
        setOrderDirection(newOptions.orderDirection);
        setCurrentPage(1);
        fetchRooms(1);
    }

    useEffect(() => {
        fetchRooms(currentPage);
    }, []);

    return (
        <>
            <Navbar />
            {
                searchInfo ? (
                    <>
                        <h1>Search Results</h1>
                        <div className="search-container">

                            <div className="filter-container">
                                <FiltersPanel onFiltersChanged={onOptionsChanged} />
                            </div>

                            <div className="contents">
                                <div className="pagination-controls">
                                    <Pagination
                                        size="large"
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        className="pagination-button"
                                        showFirstButton
                                        showLastButton
                                        variant="outlined"
                                        color="secondary"
                                    />
                                </div>

                                <br/>

                                <RoomGrid
                                    rooms={rooms}
                                />

                                <div className="pagination-controls">
                                    <Pagination
                                        size="large"
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        className="pagination-button"
                                        showFirstButton
                                        showLastButton
                                        variant="outlined"
                                        color="secondary"
                                    />
                                </div>

                            </div>
                        </div>



                    </>
                ) : (
                    <h3>No search parameters provided</h3>
                )
            }
        </>
    );
}

export default SearchPage;