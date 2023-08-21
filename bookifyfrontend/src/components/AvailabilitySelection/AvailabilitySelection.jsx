import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useState} from "react";
import {DateRange} from "react-date-range";
import './availabilitySelection.css';
import dayjs from "dayjs";

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
                                {`${dayjs(availability.startDate).format('MM/DD/YYYY')} - 
                                    ${dayjs(availability.endDate).format('MM/DD/YYYY')}`}

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
                                        startDate: dates[0].startDate.toISOString(),
                                        endDate: dates[0].endDate.toISOString(),
                                    }
                                ];
                                setAvailabilities(newAvailabilities);
                                console.log(newAvailabilities)
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