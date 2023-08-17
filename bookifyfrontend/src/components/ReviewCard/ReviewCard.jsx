import './reviewCard.css'
import React, {useEffect, useRef, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import Rating from '@mui/material/Rating';

const ReviewCard = ( {review} ) => {
    const textRef = useRef();
    const [isOverflowed, setIsOverflowed] = useState(false);

    useEffect(() => {
        const textElement = textRef.current;
        if (textElement.offsetHeight < textElement.scrollHeight) {
            setIsOverflowed(true);
        }
    }, []);

    return (
        <div className="review-card-container">
            <div className="review-content">

                <div className="review-user-info">
                    <div className= "review-user-info-items">

                        <img
                            src={'https://xx.bstatic.com/xdata/images/xphoto/square64/53668816.jpg?k=5c54b0401f64e7fe55f6b2a2e57c3606c0be15716fc872a3154a121a5a8b1317&o='}
                            className="review-profile-pic"
                        />

                        <h4>Host Name</h4>

                        <Tooltip title="Username has previously stayed in this room" placement="top">
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="verified-icon"
                            />
                        </Tooltip>

                    </div>
                </div>

                <Rating
                    name="half-rating-read"
                    defaultValue={2.5}
                    precision={0.5}
                    readOnly
                    className="view-review-rating"
                />

                <div ref={textRef} className="review-comment-container">
                    <span>
                        fgjsakl;kkklklklklk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;l;l;kjg'fflkl;vfdlkbfd
                        kagdjfffffffffffffffffffffffffffffvfffffmvvvgvvl;vgj;;;;;;;j;j;j;j;j;j;j;j;j;j;j;gkgkj;fgkjerkjg
                        vflksdajbmvaaaaaabamvbmvabmvabmvabmvabamvbamvbamvbamvbamvbmvabmvabmvbkfv mgfjkavvvvmkvmfd,vf,m
                        fgjsakl;kkklklklklk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;lk;l;l;kjg'fflkl;vfdlkbfd
                        kagdjfffffffffffffffffffffffffffffvfffffmvvvgvvl;vgj;;;;;;;j;j;j;j;j;j;j;j;j;j;j;gkgkj;fgkjerkjg
                        vflksdajbmvaaaaaabamvbmvabmvabmvabmvabamvbamvbamvbamvbamvbmvabmvabmvbkfv mgfjkavvvvmkvmfd,vf,m
                    </span>
                </div>

                {isOverflowed && <button>Click to view more</button>}

            </div>
        </div>
    )
}

export default ReviewCard;