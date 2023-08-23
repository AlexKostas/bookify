import {createContext, useContext, useEffect, useState} from 'react';
import {useSessionStorage} from "../hooks/useSessionStorage";

// Create the context
export const FilterOptionsContext = createContext();

// Create a custom hook to access the context
export const useFilterOptions = () => {
    return useContext(FilterOptionsContext);
};

export const FilterOptionsProvider = ({ children }) => {
    const [filterOptions, setFilterOptions] = useState({
        selectedAmenities: [],
        selectedRoomTypes: [],
        maxPrice: 600,
        orderDirection: 'ASC',
        page: 0
    });
    const { removeItem, getItem, setItem } = useSessionStorage();


    const resetState = () => {
        setFilterOptions(null);
        removeItem("paginationState");
    }

    const setOptions = (options) => {
        setFilterOptions(options)
        setItem("paginationState", JSON.stringify(options));
    }

    useEffect(() => {
        const rawInfo = getItem('paginationState')
        if(!rawInfo) return;

        const info = JSON.parse(rawInfo);

        if(info) setFilterOptions(info);
    }, []);

    return (
        <FilterOptionsContext.Provider value={{ filterOptions, setOptions, resetState }}>
            {children}
        </FilterOptionsContext.Provider>
    );
};