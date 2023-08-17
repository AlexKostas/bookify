import './reviewCard.css'
import React, {useEffect, useRef, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import Rating from '@mui/material/Rating';
import axios from "../../api/axios";
import {CircularProgress} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ReviewCard = ( {review} ) => {
    const textRef = useRef();
    const [isOverflowed, setIsOverflowed] = useState(false);
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const fetchImage = async () => {
        const link = `/upload/getProfilePic/${review.username}`;

        await axios.get(link, { responseType: 'blob' })
            .then(response => {
                    const url = URL.createObjectURL(response.data);
                    setLoading(false);
                    setImageData(url);
                }

            )
            .catch(error => {
                console.error('Failed to fetch image:', error);
                setLoading(false);
                setImageData(null);
            });
    }

    useEffect(() => {
        const textElement = textRef.current;
        if (textElement.offsetHeight < textElement.scrollHeight) {
            setIsOverflowed(true);
        }
    }, []);

    useEffect(() => {
        fetchImage();
    }, [review]);

    return (
        <div className={`review-card-container ${expanded ? 'expanded' : 'not-expanded'}`}>
            <div className="review-content">

                <div className="review-user-info">
                    <div className= "review-user-info-items">

                        { loading ? <CircularProgress /> :
                            <img
                            src={imageData}
                            className="review-profile-pic"
                            />
                        }

                        <h4>{review.username}</h4>

                        { !review.reviewerVisitedRoom &&
                            <Tooltip
                            title={`${review.username} has previously stayed in this room`}
                            placement="top"
                            classes={{tooltip: 'centered-tooltip'}}
                            arrow
                            >
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="verified-icon"
                                />
                            </Tooltip>
                        }

                        <Tooltip
                            title={expanded ? "View less" : "View more"}
                            placement="top"
                            classes={{tooltip: 'centered-tooltip'}}
                            arrow
                        >
                            <IconButton onClick={() => {
                                            setExpanded(!expanded);
                                         }}
                                        color="primary"
                                        className="expand-button">
                                {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Tooltip>

                    </div>
                </div>

                <Rating
                    name="half-rating-read"
                    value={review.stars}
                    readOnly
                    className="view-review-rating"
                />


                <div ref={textRef} className="review-comment-container">
                    <span>
                        {review.comment}
                    </span>
                </div>

                {/*{isOverflowed && <button>Click to view more</button>}*/}

            </div>
        </div>
    )
}

export default ReviewCard;