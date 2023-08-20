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
    });

    return (
        <FilterOptionsContext.Provider value={{ filterOptions, setFilterOptions }}>
            {children}
        </FilterOptionsContext.Provider>
    );
};