import './filtersPanel.css'
import CheckboxSelection from "../FilterPanel/CheckboxSelection";
import {useEffect, useState} from "react";
import {Slider, Stack} from "@mui/material";

const FiltersPanel = ( {onFiltersChanged} ) => {
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [maxPrice, setMaxPrice] = useState(120);
    const [orderDirection, setOrderDirection] = useState('ASC');
    const [isMounted, setIsMounted] = useState(false);

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

        onFiltersChanged(options);
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

    return (
        <div className="filtersPanel">
            <h1>Filters</h1>
            <br/>

            <div className="panelContent">
                <CheckboxSelection
                    title={'Amenities'}
                    endpointURL={'/amenities/getAllAmenities'}
                    onFiltersChanged={onAmenitiesChanged}
                />

                <br/>

                <CheckboxSelection
                    title={'Room Type'}
                    endpointURL={'/roomType/getAll'}
                    onFiltersChanged={onRoomTypesChanged}
                />

                <br/>

                <Stack spacing={2} direction="column" sx={{ mb: 1 }} alignItems="center">
                    <h3>Max Price: {maxPrice} $</h3>
                    <hr style={{width: "90%",  margin: 'auto'}} />
                    <Slider
                        aria-label="Always visible"
                        min = {50}
                        max = {3000}
                        defaultValue={120}
                        getAriaValueText={valueToText}
                        step={5}
                        valueLabelDisplay="auto"
                        onChange ={(event, newValue) => {
                            setMaxPrice(newValue);
                        }}
                    />
                </Stack>

                <br/>

                <div className="sort">
                    <label>
                        Order By Price:
                        <select value={orderDirection} onChange={(event) => handleSortingChange(event.target.value)}>
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>
                    </label>
                </div>

                <br/>
            </div>

        </div>
    )
}

export default FiltersPanel;