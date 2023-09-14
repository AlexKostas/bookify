import {useSearchContext} from "../context/SearchContext";
import Navbar from "../components/Navbar/Navbar";
import RoomGrid from "../components/RoomGrid/RoomGrid";
import {useEffect, useState} from "react";
import FiltersPanel from "../components/FiltersPanel/FiltersPanel";
import './styles/searchPage.css';
import axios from "../api/axios";
import {Pagination} from "@mui/material";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {useFilterOptions} from "../context/FilterOptionsContext";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Footer from "../Footer/Footer";
import './styles/page.css';

const SearchPage = () => {
    const { searchInfo } = useSearchContext();
    const { filterOptions, setOptions:setFilterOptions } = useFilterOptions();

    const itemsPerPage = 9;
    const [rooms, setRooms] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderDirection, setOrderDirection] = useState('ASC');
    const [options, setOptions] = useState({
        amenities: [],
        maxPrice: 600,
        roomTypes: [],
        orderDirection: 'ASC',
    });
    const [loading, setLoading] = useState(true);
    const [initSetup, setInitSetup] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const fetchRooms = async (currentPage) => {
        if(!searchInfo) return;

        const endpointURL = '/search/search';
        try{
            setLoading(true);
            const response = await (auth ? axiosPrivate : axios).put
            (`${endpointURL}?pageNumber=${currentPage-1}&pageSize=${itemsPerPage}&orderDirection=${orderDirection}`,
                JSON.stringify(
                    {
                        tenants: searchInfo.tenants,
                        startDate: searchInfo.checkInDate,
                        endDate: searchInfo.checkOutDate,
                        city: searchInfo.city,
                        state: searchInfo.state,
                        country: searchInfo.country,

                        amenitiesIDs: options.amenities,
                        maxPrice: options.maxPrice,
                        roomTypesIDs: options.roomTypes,
                    }
                )

            );

            setRooms(response.data.content);
            setTotalPages(response.data.totalPages);
            // console.log(response.data.totalPages);
        }
        catch(error){
            console.log(error);
        }
        finally {
            setLoading(false)
        }
    }

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        setFilterOptions({...filterOptions, page: newPage})
    }

    const onOptionsChanged = (newOptions) => {
        setOrderDirection(newOptions.orderDirection);
        setOptions(newOptions);

        (initSetup && filterOptions?.page) ? setCurrentPage(filterOptions.page) : setCurrentPage(1);

        setInitSetup(false);
    }

    useEffect(() => {
        (isMounted || !filterOptions) && fetchRooms(currentPage);
        setIsMounted(true);
    }, [currentPage, options, searchInfo]);

    return (
        <>
            <div className="page-container">
                <Navbar />
                <div className="content">
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
                                            loading={loading}
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
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default SearchPage;