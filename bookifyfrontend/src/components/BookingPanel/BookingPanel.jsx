import './bookingPanel.css'
import {useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import BookingDetails from "../BookingDetails/BookingDetails";

const BookingPanel = ({ room, roomID }) => {
    const [breakdownActive, setBreakdownActive] = useState(false);
    const [detailsActive, setDetailsActive] = useState(false);
    const [selectedCheckInDate, setSelectedCheckInDate] = useState();
    const [selectedCheckOutDate, setSelectedCheckOutDate] = useState();
    const [visitors, setVisitors] = useState(1);
    const [nights, setNights] = useState(0);

    const formatDate = (date) => {
        if (date) return date.format('MM-DD-YYYY')
        else return '---'
    };

    const onSubmit = (checkIn, checkOut, tenants, nights) => {
        setSelectedCheckInDate(checkIn);
        setSelectedCheckOutDate(checkOut);
        setVisitors(tenants);
        setNights(nights);
    }

    const pricePerNight = room?.pricePerNight +
        (visitors - room?.maxTenants > 0 ? (visitors - room?.maxTenants)* room?.extraCostPerTenant : 0);

    const totalPrice = pricePerNight * nights;

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
                        {room?.pricePerNight?.toFixed(2)}$ / night x {`${nights} night${nights > 1 ? 's': ''}`}
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

                <button
                    className='book-button'
                >
                    Book Now
                </button>
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
        </div>
    )
}

export default BookingPanel;