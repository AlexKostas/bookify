import { createContext, useContext, useState } from 'react';

// Create the context
export const FilterOptionsContext = createContext();

// Create a custom hook to access the context
export const useFilterOptions = () => {
    return useContext(FilterOptionsContext);
};

// Create the provider component
export const FilterOptionsProvider = ({ children }) => {
    const [filterOptions, setFilterOptions] = useState({
        selectedAmenities: [],
        selectedRoomTypes: [],
        maxPrice: 600,
        orderDirection: 'ASC',
        page: 0
    });

    const resetSearch = () => {
        setFilterOptions(null);
        //removeItem("searchInfo");
    }

    const setOptions = (options) => {
        setFilterOptions(options)
        //setItem("paginationState");
    }

    return (
        <FilterOptionsContext.Provider value={{ filterOptions, setOptions, resetSearch }}>
            {children}
        </FilterOptionsContext.Provider>
    );
};