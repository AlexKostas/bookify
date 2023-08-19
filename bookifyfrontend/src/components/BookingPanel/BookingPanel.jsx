import './bookingPanel.css'
import {useState} from "react";
import {Icon} from "@mui/material";
import WarningIcon from '@material-ui/icons/Warning';
import Tooltip from "@mui/material/Tooltip";

import BookingDetails from "../BookingDetails/BookingDetails";

const BookingPanel = ({ room, roomID }) => {
    const [breakdownActive, setBreakdownActive] = useState(false);
    const [detailsActive, setDetailsActive] = useState(false);

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
                                <td><strong>Check-in Date</strong><br />13-05-2023</td>
                                <td><strong>Check-out Date</strong><br />13-05-2023</td>
                                </thead>
                                <tbody>
                                <tr>
                                    <td colSpan="2">
                                        <strong>Visitors</strong>
                                        <br />
                                        2 visitors
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Tooltip>

                    </button>

                </div>

                <div className='booking-info'>

                    <div className="minimum-stay-warning-container">
                        <Icon component={WarningIcon} className="warning-icon" />
                       Min Stay: 14 nights
                    </div>


                    <p>
                        300$ / night x 4 nights
                    </p>
                    <p>
                        Total: 13000$
                    </p>

                    <button
                        className="cost-breakdown-button"
                        onClick={() => setBreakdownActive(!breakdownActive)}
                    >
                        <u>{breakdownActive ? "Hide cost breakdown" : "Show cost breakdown"}</u>
                    </button>

                    {
                        breakdownActive &&(
                            <div>
                                <p>
                                    100$ / night for 4 people + 20$ per extra person for a total of 2 extra people
                                </p>
                                <p>
                                    Total: 300$ / night
                                </p>
                            </div>
                        )
                    }
                </div>

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
                        onClose={() => setDetailsActive(false)}
                        roomID={roomID}
                        minStay={room.minimumStay}
                    />
            }
        </div>
    )
}

export default BookingPanel;