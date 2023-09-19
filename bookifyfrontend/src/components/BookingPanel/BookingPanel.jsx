import './bookingPanel.css'
import {useEffect, useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import BookingDetails from "../BookingDetails/BookingDetails";
import {Backdrop, CircularProgress} from "@mui/material";
import useAuth from "../../hooks/useAuth";
import {useSearchContext} from "../../context/SearchContext";
import dayjs from "dayjs";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import Lottie from 'react-lottie';
import check from "../../images/tick.json";
import Typography from "@mui/material/Typography";

const BookingPanel = ({ room, roomID }) => {
    const [breakdownActive, setBreakdownActive] = useState(false);
    const [detailsActive, setDetailsActive] = useState(false);
    const [selectedCheckInDate, setSelectedCheckInDate] = useState();
    const [selectedCheckOutDate, setSelectedCheckOutDate] = useState();
    const [visitors, setVisitors] = useState(1);
    const [nights, setNights] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [backdropOpen, setBackdropOpen] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { searchInfo } = useSearchContext();

    const isTenant = auth?.roles.includes('tenant');
    const allInfoProvided = selectedCheckInDate && selectedCheckOutDate;
    const sameHost = auth?.user === room?.hostUsername;
    const bookButtonActive = auth && isTenant && allInfoProvided && !sameHost && room

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: check,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const formatDate = (date) => {
        if (date) return date.format('MM-DD-YYYY')
        else return '---'
    };

    const onSubmit = (checkIn, checkOut, tenants, nights) => {
        setSelectedCheckInDate(checkIn);
        setSelectedCheckOutDate(checkOut);
        setVisitors(tenants);
        setNights(nights);

        setError('')
    }

    const onBook = async () => {
        setLoading(true);
        setError('');

        try {
            const endpointURL = '/booking/book';
            const response = await axiosPrivate.post(endpointURL, JSON.stringify({
                roomID,
                checkInDate: selectedCheckInDate.toDate().toLocaleDateString("sv"),
                checkOutDate: selectedCheckOutDate.toDate().toLocaleDateString("sv"),
                numberOfTenants: visitors,
            }));

            setSelectedCheckInDate(null);
            setSelectedCheckOutDate(null);
            setNights(0);
            setVisitors(1);

            setBackdropOpen(true);
        }
        catch (err) {
            console.log(err);

            if (!err?.response)
                setError('No server response');
            else if (err.response?.status === 400)
                setError('This room is not available in the given date range');
            else if (err.response?.status === 403)
                setError('You can not book your own room');
            else if (err.response?.status === 404)
                setError('Room not found');
            else
                setError('An error occurred. Check the console for more details');
        }
        finally {
            setLoading(false);
        }
    }

    const pricePerNight = room?.pricePerNight +
        (visitors - room?.maxTenants > 0 ? (visitors - room?.maxTenants)* room?.extraCostPerTenant : 0);

    const totalPrice = pricePerNight * nights;

    useEffect(() => {
        if(!searchInfo) return;

        const tempCheckInDate = dayjs(searchInfo.checkInDate);
        const tempCheckoutDate = dayjs(searchInfo.checkOutDate);

        setSelectedCheckInDate(tempCheckInDate);
        setSelectedCheckOutDate(tempCheckoutDate);
        setVisitors(searchInfo.tenants);

        const numberOfNights = (!tempCheckInDate ||tempCheckoutDate.isSame(tempCheckInDate)) ? 0 : tempCheckoutDate.diff(tempCheckInDate, 'day') + 1;
        setNights(numberOfNights);
    }, [searchInfo]);

    return (
        <div className='bookingContainer'>
            <div className='booking-content'>

                <div className="booking-dates-container">
                    <Typography
                        variant="h3"
                        sx={{
                            color: 'white',
                            fontSize: '2rem'
                        }}
                    >
                        Dates
                    </Typography>
                    <hr style={{width: "90%",  margin: 'auto'}} />

                    <button
                        onClick={() => setDetailsActive(true)}
                        className="booking-info-parent"
                    >
                        <Tooltip title="Click to edit" placement="top" arrow>
                            <table>
                                <thead>
                                <td><strong>Check-in Date</strong><br />{formatDate(selectedCheckInDate)}</td>
                                <td><strong>Check-out Date</strong><br />{formatDate(selectedCheckOutDate)}</td>
                                </thead>
                                <tbody>
                                <tr>
                                    <td colSpan="2">
                                        <strong>Visitors</strong>
                                        <br />
                                        {`${visitors} visitor${visitors > 1 ? 's' : ''}`}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Tooltip>

                    </button>

                </div>

                {
                    nights > 0 &&
                    <div className='booking-info'>

                    <p>
                        {pricePerNight.toFixed(2)}$ / night x {`${nights} night${nights > 1 ? 's': ''}`}
                    </p>
                    <p>
                        Total: {totalPrice.toFixed(2)}$
                    </p>

                    <button
                        className="cost-breakdown-button"
                        onClick={() => setBreakdownActive(!breakdownActive)}
                    >
                        <u>{breakdownActive ? "Hide cost breakdown" : "Show cost breakdown"}</u>
                    </button>

                    {
                        breakdownActive && (
                            <div  style={{ color: "white" }}>
                                <p>
                                    {room?.pricePerNight?.toFixed(2)}$ / night for up to {room?.maxTenants} people
                                    {
                                        visitors - room?.maxTenants > 0 &&
                                        <span>
                                          + {room?.extraCostPerTenant?.toFixed(2)}$ per extra person for a total
                                    of {visitors - room?.maxTenants} extra {visitors - room?.maxTenants > 1 ? 'people' : 'person'}
                                     </span>
                                    }
                                </p>
                                <br />
                                <p>
                                    Total: {pricePerNight.toFixed(2)}$ / night
                                </p>
                            </div>
                        )
                    }
                </div>
                }

                <Tooltip
                    title={
                        !allInfoProvided ? 'No date range set' :
                            !auth ? 'Login to book'
                                : (sameHost ? 'You can not book your own room' :
                                    !isTenant && 'You need to be a tenant to book')
                    }
                    placement="top"
                    arrow
                >

                    <button
                        disabled={!bookButtonActive}
                        onClick={onBook}
                        className='book-button'
                    >
                        {loading ? <CircularProgress /> : 'Book Now'}
                    </button>

                </Tooltip>

                {
                    error !== '' &&
                    <div className="booking-options-error">
                        <FontAwesomeIcon icon={faCircleExclamation} style={{color: "#ff0000", marginRight: '3%'}}/>
                        {error}
                    </div>
                }

            </div>

            {
                detailsActive &&
                    <BookingDetails
                        open={detailsActive}
                        onSubmit={onSubmit}
                        onClose={() => setDetailsActive(false)}
                        roomID={roomID}
                        minStay={room?.minimumStay}
                        initData={{
                            selectedCheckInDate,
                            selectedCheckOutDate,
                            visitors
                        }}
                    />
            }

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, display:'flex', flexDirection:'column',
                gap: '0', backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
                open={backdropOpen}
                onClick={() => setBackdropOpen(false)}
            >
                <h1>Successful Reservation</h1>

                {
                    backdropOpen && <Lottie options={defaultOptions} height={200} width={200}/>
                }
            </Backdrop>
        </div>
    )
}

export default BookingPanel;