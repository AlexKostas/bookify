import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from '../../api/axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './searchField.css';

const SearchField = ( {onSelection} ) => {
    const [suggestions, setSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const fetchSuggestions = async (inputValue) => {
        const endpointUrl = `/search/autocomplete?input=${inputValue}`

        try {
            const response = await axios.get(endpointUrl);
            const data = response.data || [];

            setSuggestions(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = async (event, value) => {
        setInputValue(value);
        fetchSuggestions(value);
    }

    const handleSelect = (event, value) => {
        onSelection(value);
    }

    useEffect(() => {
        fetchSuggestions(inputValue);
    }, []);

    return (
        <Autocomplete
            options={suggestions}
            getOptionLabel={(option) => option}
            onChange={handleSelect}
            onInputChange={handleInputChange}
            className="autocomplete-bar"
            renderInput={(params) => (
                <TextField
                    {...params}
                    value={inputValue ? 'Location...' : ''}
                    forcePopupIcon={false}
                    size = "small"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <LocationOnIcon
                                    sx={{ color: 'gray'}}
                                    className="location-icon"
                                />
                                {params.InputProps.startAdornment}
                            </>
                        ),
                        classes: {
                            root: 'search-bar-root',
                            focused: 'search-bar-focused',
                        },
                    }}
                />
            )}
        />
  );
}

export default SearchField;