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
    const sameHost = auth?.user === room.hostUsername;
    const bookButtonActive = auth && isTenant && allInfoProvided && !sameHost;

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

    const downloadFile = (content) => {

        const blob = new Blob(['%PDF-1.4\n' +
        '%����\n' +
        '1 0 obj\n' +
        '<<\n' +
        '/Type /Catalog\n' +
        '/Version /1.4\n' +
        '/Pages 2 0 R\n' +
        '>>\n' +
        'endobj\n' +
        '2 0 obj\n' +
        '<<\n' +
        '/Type /Pages\n' +
        '/Kids [3 0 R]\n' +
        '/Count 1\n' +
        '>>\n' +
        'endobj\n' +
        '3 0 obj\n' +
        '<<\n' +
        '/Type /Page\n' +
        '/MediaBox [0.0 0.0 612.0 792.0]\n' +
        '/Parent 2 0 R\n' +
        '/Contents 4 0 R\n' +
        '/Resources 5 0 R\n' +
        '>>\n' +
        'endobj\n' +
        '4 0 obj\n' +
        '<<\n' +
        '/Length 187\n' +
        '/Filter /FlateDecode\n' +
        '>>\n' +
        'stream\n' +
        'x�]б�0\f�O�Q���(\b���.�y]+��@�I|{{\n' +
        '�!��?IZeh\bL�Y�u]�����3�0D\t��-V@�!�ۛx��oF;������"ɵ,mI�;�D�E��\n' +
        'v�X���$�ԟ�So�$rdL���{ԁ���#���6��JA~M:������\n' +
        '�G������t1�����O�\n' +
        'endstream\n' +
        'endobj\n' +
        '5 0 obj\n' +
        '<<\n' +
        '/Font 6 0 R\n' +
        '>>\n' +
        'endobj\n' +
        '6 0 obj\n' +
        '<<\n' +
        '/F1 7 0 R\n' +
        '>>\n' +
        'endobj\n' +
        '7 0 obj\n' +
        '<<\n' +
        '/Type /Font\n' +
        '/Subtype /Type1\n' +
        '/BaseFont /Helvetica-Bold\n' +
        '/Encoding /WinAnsiEncoding\n' +
        '>>\n' +
        'endobj\n' +
        'xref\n' +
        '0 8\n' +
        '0000000000 65535 f\n' +
        '0000000015 00000 n\n' +
        '0000000078 00000 n\n' +
        '0000000135 00000 n\n' +
        '0000000247 00000 n\n' +
        '0000000508 00000 n\n' +
        '0000000541 00000 n\n' +
        '0000000572 00000 n\n' +
        'trailer\n' +
        '<<\n' +
        '/Root 1 0 R\n' +
        '/ID [<32792F7381098FFEBA1596D258436267> <32792F7381098FFEBA1596D258436267>]\n' +
        '/Size 8\n' +
        '>>\n' +
        'startxref\n' +
        '674\n' +
        '%%EOF\n'], {type: "application/pdf"})
        console.log(blob);
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = "data.pdf";
        a.click();

        URL.revokeObjectURL(url);
    }

    const onBook = async () => {
        setLoading(true);
        setError('');

        try {
            const endpointURL = '/booking/book';
            const response = await axiosPrivate.post(endpointURL, JSON.stringify({
                roomID,
                checkInDate: selectedCheckInDate,
                checkOutDate: selectedCheckOutDate,
                numberOfTenants: visitors
            }));
            console.log(response.data); // Log the response data
                downloadFile(response.data);

                setSelectedCheckInDate(null);
                setSelectedCheckOutDate(null);
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

        setSelectedCheckInDate(dayjs(searchInfo.checkInDate));
        setSelectedCheckOutDate(dayjs(searchInfo.checkOutDate));
        setVisitors(searchInfo.tenants);

        const numberOfNights = (!selectedCheckInDate ||selectedCheckOutDate.isSame(selectedCheckInDate)) ? 0 : selectedCheckOutDate.diff(selectedCheckInDate, 'day') + 1;
        setNights(numberOfNights);
    }, [searchInfo]);

    return (
        <div className='bookingContainer'>
            <div className='booking-content'>

                <div className="booking-dates-container">
                    <h3>Dates</h3>
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
                            <div>
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
                        minStay={room.minimumStay}
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