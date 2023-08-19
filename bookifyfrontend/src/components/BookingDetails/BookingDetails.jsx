import './bookingDetails.css';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {useEffect, useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {CircularProgress} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import axios from "../../api/axios";

const BookingDetails = ( {open, onSubmit, onClose, roomID, minStay, initData} ) => {
    const [checkInDate, setCheckInDate] = useState(dayjs());
    const [checkOutDate, setCheckOutDate] = useState(checkInDate.add(minStay, 'day'));
    const [people, setPeople] = useState(1);
    const [loading, setLoading] = useState(false);
    const [available, setAvailable] = useState(false);
    const [numberOfNights, setNumberOfNights] = useState(0);
    const [error, setError] = useState('');

    const currentDate = dayjs();

    const fetchAvailability = async () => {
        const endpointURL = '/booking/isAvailable';

        try {
            setLoading(true);

            const response = await axios.post(endpointURL, JSON.stringify({
                roomID: parseInt(roomID),
                checkInDate,
                checkOutDate,
                numberOfTenants: people,
            }));


            const isAvailable = response?.data.available;
            setAvailable(isAvailable);
            if(!isAvailable) setError('Room is unavailable in the given date range');
        }
        catch (err){
            console.log(err);

            if (!err?.response)
                setError('No server response');
            else if (err.response?.status === 404)
                setError('Room not found');
            else
                setError('An error occurred. Check the console for more details');
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setError('');

        const numberOfDays = checkOutDate.isSame(checkInDate) ? 0 : checkOutDate.diff(checkInDate, 'day') + 1;
        setNumberOfNights(numberOfDays);

        if(numberOfDays < minStay){
            setAvailable(false);
            setError(`Minimum stay is ${minStay} night${minStay > 1 && 's'}`)
            return;
        }

        fetchAvailability();

    }, [checkInDate, checkOutDate]);

    useEffect(() => {
        if(!initData) return;

        setPeople(initData.visitors);
        if(initData.selectedCheckInDate) setCheckInDate(initData.selectedCheckInDate);
        if(initData.selectedCheckOutDate) setCheckOutDate(initData.selectedCheckOutDate);
    }, [initData])

    return (
        <div>
            <Dialog open={open} onClose={onClose} maxWidth="md">
                <DialogTitle
                    style={
                    {
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    } }
                >
                    Booking Details

                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                            <DatePicker
                                label="Check-in Date"
                                value={checkInDate}
                                minDate={currentDate}
                                onChange={(newValue) => setCheckInDate(newValue)}
                            />

                            <DatePicker
                                label="Check-out Date"
                                value={checkOutDate}
                                minDate={checkInDate}
                                onChange={(newValue) => setCheckOutDate(newValue)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <div className="people-selection-last-row">
                        <div className="people-selection-container">
                            <span>People: </span>

                            <div className="people-selection-holder">
                                <button
                                    onClick={() => people > 1 && setPeople(people-1)}
                                    className="people-selection-button"
                                >
                                    -
                                </button>

                                <span>{people}</span>

                                <button
                                    onClick={() => setPeople(people + 1)}
                                    className="people-selection-button"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if(onSubmit) onSubmit(checkInDate, checkOutDate, people, numberOfNights);
                                onClose();
                            }}
                            disabled={!available}
                            className='book-options-confirm-button'
                        >
                            {
                                loading ?
                                    <div className="book-options-confirm-button-container">
                                        <span>Checking availability</span>
                                        <CircularProgress />
                                    </div>
                                    : available ? <span>Confirm</span> : <span>Unavailable</span>

                            }
                        </button>
                    </div>

                    {
                        error !== '' &&
                        <div className="booking-options-error">
                            <FontAwesomeIcon icon={faCircleExclamation} style={{color: "#ff0000", marginRight: '3%'}}/>
                            {error}
                        </div>
                    }

                </DialogContent>

            </Dialog>
        </div>
    );
}

export default BookingDetails;