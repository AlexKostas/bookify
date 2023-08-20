import {useEffect, useState} from "react";
import useFetchItems from "../../hooks/useFetchItems";
import {Stack} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {blue} from "@mui/material/colors";
import "./checkboxSelection.css"

const CheckboxSelection = ({title, onFiltersChanged, endpointURL, defaultData, onlyOneOption = false}) => {
    const [selectedItems, setSelectedItems] = useState(new Set());
    const { availableItems } = useFetchItems(endpointURL);

    const handleApplyFilter = (itemID, checked) => {
        const newItems = onlyOneOption ? new Set() : new Set(selectedItems);
        if(checked)
            newItems.add(itemID);
        else
            newItems.delete(itemID);

        setSelectedItems(newItems);
        onFiltersChanged(Array.from(newItems));
    }

    useEffect(() => {
        if(!defaultData) return;

        setSelectedItems(new Set(defaultData));
    }, []);

    return (
        <div>
            <h3 className="selection-title">{title}</h3>

            <hr style={{width: "90%",  margin: 'auto'}} />

            <Stack spacing={2} alignItems="left" className="filter-panel-dropdown">
                    <div>
                    {
                        availableItems.map((item) => (
                            <div key={item.id}>
                                <label key={item.id}>
                                    <Checkbox
                                        onChange={(e) => handleApplyFilter(item.id, e.target.checked)}
                                        defaultChecked={selectedItems?.has(item.id)}
                                        checked={selectedItems?.has(item.id)}

                                        sx={{
                                            color: blue[1000],
                                            '&.Mui-checked': {
                                                color: blue[900],
                                            },
                                        }}
                                    />

                                    {item.name}

                                    <p className="description">{item.description}</p>
                                </label>
                            </div>
                        ))
                    }
                    </div>
            </Stack>
        </div>
  );

}

export default CheckboxSelection;