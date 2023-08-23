import './reviewCard.css'
import React, {useEffect, useRef, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VerifiedIcon from '@mui/icons-material/Verified';import Tooltip from '@mui/material/Tooltip';
import Rating from '@mui/material/Rating';
import axios from "../../api/axios";
import {CircularProgress} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";

const ReviewCard = ( {review, usersReview = false, onEdit, onDelete} ) => {
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

                {
                    usersReview &&
                    <div className="review-actions-panel">
                        <Tooltip title="Edit Review" placement="top" arrow>
                            <IconButton onClick={() => onEdit(review.reviewID)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Review" placement="top" arrow>
                            <IconButton onClick={() => onDelete(review.reviewID)} style={{ color: 'red' }}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                }

                <div className="review-user-info">
                    <div className= "review-user-info-items">

                        { review.reviewerVisitedRoom &&
                            <Tooltip
                                title={`${review.username} has previously stayed in this room`}
                                placement="top"
                                classes={{tooltip: 'centered-tooltip'}}
                                arrow
                            >
                                <VerifiedIcon className="verified-icon" />
                            </Tooltip>
                        }

                        { loading ? <CircularProgress /> :
                            <img
                            src={imageData}
                            className="review-profile-pic"
                            />
                        }

                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <h4>{review.username}</h4>
                            <h5 style={{color: "lightgray"}}>on {dayjs(review.date).format("MM/DD/YYYY")}</h5>
                        </div>


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