import './filtersPanel.css'
import CheckboxSelection from "../CheckboxSelection/CheckboxSelection";
import {useEffect, useState} from "react";
import {MenuItem, Select, Slider, Stack} from "@mui/material";
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import {useFilterOptions} from "../../context/FilterOptionsContext";
import * as React from "react";

const Input = styled(MuiInput)`
  width: 40%;
  color: lightgray;
`;

function clamp(value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
}

const FiltersPanel = ( {onFiltersChanged} ) => {
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [maxPrice, setMaxPrice] = useState(600);
    const [orderDirection, setOrderDirection] = useState('ASC');
    const [isMounted, setIsMounted] = useState(false);

    const { filterOptions, setOptions } = useFilterOptions();

    const onAmenitiesChanged = (newAmenities) => {
        setSelectedAmenities(newAmenities);
    }

    const onRoomTypesChanged = (newRoomTypes) => {
        setSelectedRoomTypes(newRoomTypes)
    }

    const onOptionsChanged = () => {
        const options = {
            amenities: selectedAmenities,
            roomTypes: selectedRoomTypes,
            maxPrice,
            orderDirection,
        }

        if(isMounted) {
            setOptions(options);
            onFiltersChanged(options);
        }
    }

    const handleSortingChange = (value) => {
        setOrderDirection(value);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    const valueToText = (value) => {
        return value + "$";
    }

    useEffect(() => {
        if(isMounted){
            onOptionsChanged();
        }

        setIsMounted(true)
    }, [selectedAmenities, selectedRoomTypes, orderDirection, maxPrice]);

    useEffect(() => {
        if(!filterOptions) return;

        setSelectedAmenities(filterOptions.amenities || []);
        setSelectedRoomTypes(filterOptions.roomTypes || []);
        setMaxPrice(filterOptions.maxPrice || 600);
        setOrderDirection(filterOptions.orderDirection || 'ASC');
    }, [filterOptions]);

    return (
        <div className="filtersPanel">
            <h1>Filters</h1>
            <br/>

            <div className="panelContent">
                <CheckboxSelection
                    title={'Amenities'}
                    endpointURL={'/amenities/getAllAmenities'}
                    onFiltersChanged={onAmenitiesChanged}
                    defaultData={selectedAmenities}
                    enableDescriptions={false}
                />

                <br/>

                <CheckboxSelection
                    title={'Room Type'}
                    endpointURL={'/roomType/getAll'}
                    onFiltersChanged={onRoomTypesChanged}
                    defaultData={selectedRoomTypes}
                    enableDescriptions={false}
                />

                <br/>

                <Stack spacing={2} direction="column" sx={{ mb: 1 }} alignItems="center">
                    <h3>Max Price: {maxPrice} $</h3>
                    <hr style={{width: "90%",  margin: 'auto'}} />
                    <Slider
                        aria-label="Always visible"
                        min = {50}
                        max = {3000}
                        defaultValue={filterOptions?.maxPrice || 600}
                        getAriaValueText={valueToText}
                        step={5}
                        valueLabelDisplay="auto"
                        onChange ={(event, newValue) => {
                            setMaxPrice(newValue);
                        }}
                    />

                    <Input
                        value={maxPrice}
                        size="small"
                        onChange ={(event) => {
                            setMaxPrice(clamp(event.target.value, 10, 15000));
                        }}
                        inputProps={{
                            step: 10,
                            min: 0,
                            max: 15000,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Stack>

                <br/>
                <div className="sort">
                    <span>Order By Price:</span>
                    <Select
                        labelId="select-label"
                        id="dropdown"
                        size = "small"
                        value={orderDirection}
                        defaultValue={orderDirection || 'ASC'}
                        onChange={(event) => handleSortingChange(event.target.value)}
                        sx = {{
                            '& .MuiSelect-icon': {
                                color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white !important',
                            },
                            color: "white",
                            width: "65%",
                        }}
                    >

                        <MenuItem value="ASC">Ascending</MenuItem>
                        <MenuItem value="DESC">Descending</MenuItem>
                    </Select>
                </div>
                <br/>
            </div>

        </div>
    )
}

export default FiltersPanel;