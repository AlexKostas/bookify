import './bookingPanel.css'
import {useState} from "react";
import {Icon} from "@mui/material";
import WarningIcon from '@material-ui/icons/Warning';

const BookingPanel = () => {
    const [breakdownActive, setBreakdownActive] = useState(false);

    return (
        <div className='bookingContainer'>
            <div className='booking-content'>

                <div className="booking-dates-container">
                    <h3>Dates</h3>
                    <hr style={{width: "90%",  margin: 'auto'}} />
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
        </div>
    )
}

export default BookingPanel;