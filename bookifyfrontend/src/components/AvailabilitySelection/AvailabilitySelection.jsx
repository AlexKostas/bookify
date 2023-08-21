import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useEffect, useState} from "react";
import {DateRange} from "react-date-range";
import { format } from "date-fns";
import './availabilitySelection.css';

const AvailabilitySelection = ({ onAvailabilityChanged }) => {
    const [availabilities, setAvailabilities] = useState([]);
    const [showDate, setShowDate] = useState(false);
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    return (
        <div className="selection-holder">

            <div className="main-content">

                {
                    availabilities.length > 0 ? (
                        availabilities.map((availability, index) => (
                            <div className="selection-card">
                                {`${availability.startDate} - ${availability.endDate}`}

                                <IconButton
                                    onClick={() => {
                                        setShowDate(false);

                                        const newAvailabilities = availabilities.length > 1 ?
                                            availabilities.splice(index, 1) : [];

                                        setAvailabilities(newAvailabilities);
                                        if(onAvailabilityChanged) onAvailabilityChanged(newAvailabilities);
                                    }}
                                    style={{ color: 'red' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ))

                    ) : <span>Click to add availability</span>
                }

                <IconButton
                    onClick={() => {
                        setShowDate(true);
                        //Reset date
                        setDates([
                            {
                                startDate: new Date(),
                                endDate: new Date(),
                                key: "selection",
                            },
                        ])
                    }}
                    className="selection-add-button"
                >
                    <AddIcon />
                </IconButton>
            </div>

            {
                showDate &&

                <div className="date-selection-holder">
                    <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDates([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dates}
                        className="availability-range"
                        minDate={new Date()}
                    />

                    <div className="date-selection-buttons">
                        <button
                            onClick={() => setShowDate(false)}
                            className="selection-cancel-button"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                console.log(dates);

                                const newAvailabilities = [...availabilities,
                                    {
                                        startDate: format(dates[0].startDate, "MM/dd/yyyy"),
                                        endDate: format(dates[0].endDate, "MM/dd/yyyy")
                                    }
                                ];
                                setAvailabilities(newAvailabilities);
                                if(onAvailabilityChanged) onAvailabilityChanged(newAvailabilities);
                                setShowDate(false);
                            }}
                            className="selection-confirm-button"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            }

        </div>
    )
}

export default AvailabilitySelection;