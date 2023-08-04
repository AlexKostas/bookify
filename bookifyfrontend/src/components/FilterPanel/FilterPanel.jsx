import { useState } from "react";
import useFetchAmenities from "../../hooks/useFetchAmenities";

const FilterPanel = ({onFiltersChanged}) => {
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const { availableAmenities } = useFetchAmenities();

    const handleAmenityChange = (amenity) => {

    }

    const handleApplyFilter = () => {
        onFiltersChanged(selectedAmenities);
    }

    return (
        <div>
            <button onClick={() => setShowFilterPanel(!showFilterPanel)}>
                {showFilterPanel ? 'Hide Filter Panel' : 'Show Filter Panel'}
            </button>

            {showFilterPanel && (
                <div className="filter-panel-dropdown">
                {availableAmenities.map((amenity) => (
                    <label key={amenity.id}>
                    <input type="checkbox" value={amenity} onChange={(e) => handleApplyFilter()} />
                    {amenity.name}
                    </label>
                ))}
                </div>
            )}
        </div>
  );

}

export default FilterPanel;