import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useEffect, useState} from "react";
import {DateRange} from "react-date-range";
import './availabilitySelection.css';
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

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
                <div className="availability-dates">
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
                                                    availabilities.toSpliced(index, 1) : [];

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

                    ) :
                        <div className="add-message">
                            <span>Click to add availability</span>
                        </div>
                }
                </div>
                <div className="selection-add-button">
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
                        sx = {{
                            color: "white",
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
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
                        <Button
                            onClick={() => setShowDate(false)}
                            size="small"
                            variant="contained"
                            color="error"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                console.log(dates);

                                const newAvailabilities = [...availabilities,
                                    {
                                        startDate: dates[0].startDate.toLocaleDateString("sv"),
                                        endDate: dates[0].endDate.toLocaleDateString("sv"),
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
                            size="small"
                            variant="contained"
                            color="success"
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            }

        </div>
    )
}

export default AvailabilitySelection;