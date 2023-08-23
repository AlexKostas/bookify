import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useEffect, useState} from "react";
import {DateRange} from "react-date-range";
import './availabilitySelection.css';
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";

const AvailabilitySelection = ({ onAvailabilityChanged, bookedDays, bookedRanges }) => {
    const [availabilities, setAvailabilities] = useState([]);
    const [showDate, setShowDate] = useState(false);
    const [disabledDates, setDisabledDates] = useState([])
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    useEffect(() => {
        if(!bookedDays || bookedDays.length < 1) return;

        setDisabledDates(bookedDays.map((date) => new Date(date)));
    }, [bookedDays])

    useEffect(() => {
        if(!bookedRanges || bookedRanges.length < 1) return;
        console.log(bookedRanges);

        setAvailabilities(bookedRanges.map((item) => ({...item, deletable: false})));
        console.log(bookedRanges.map((item) => ({...item, deletable: false})));
    }, [bookedRanges])

    return (
        <div className="selection-holder">

            <div className="main-content">

                {
                    availabilities.length > 0 ? (
                        availabilities.map((availability, index) => (
                            <div className="selection-card">
                                {`${dayjs(availability.startDate).format('MM/DD/YYYY')} - 
                                    ${dayjs(availability.endDate).format('MM/DD/YYYY')}`}

                                <Tooltip
                                    title={`${availability.deletable ? 'Delete Range' : 'You can not delete this range because the room is already booked for those dates'}`}
                                    placement="top"
                                    sx={{textAlign: "center"}}
                                    arrow
                                >
                                    <span>
                                        <IconButton
                                            disabled={!availability.deletable}
                                            onClick={() => {
                                                setShowDate(false);

                                                const newAvailabilities = availabilities.length > 1 ?
                                                    availabilities.splice(index, 1) : [];

                                                setAvailabilities(newAvailabilities);
                                                if(onAvailabilityChanged) onAvailabilityChanged(newAvailabilities);
                                            }}
                                            style={{ color: `${availability.deletable ? 'red' : 'gray'}` }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
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
                        disabledDates={disabledDates}
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
                                        deletable: true
                                    }
                                ];
                                setAvailabilities(newAvailabilities);
                                if(onAvailabilityChanged) onAvailabilityChanged(newAvailabilities.map((item) => ({
                                    startDate: item.startDate,
                                    endDate: item.endDate
                                })));
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