import './composeReview.css';
import {useState} from "react";
import Rating from "@mui/material/Rating";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";

const ComposeReview = () => {
    const maxCommentLength = 3;

    const [rating, setRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    const maxLengthReached = reviewComment.length >= maxCommentLength;

    return (
        <div className="review-card-container">  {/*from reviewCard.css*/}
            <div className="compose-review-content">
                <h2>New Review</h2>

                <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(event, newValue) => {
                        setRating(newValue);
                    }}
                    style={{ marginTop: '-3%', marginBottom: '1%' }}
                />

                <textarea
                    value={reviewComment}
                    onChange={(e) => {
                        setReviewComment(e.target.value);
                        // setError(null);
                    }}
                    required
                    placeholder="Type your comment here..."
                    maxLength={maxCommentLength}
                    className={`review-comment-input ${maxLengthReached && 'text-area-maxed-out'} `}
                />

                <div className="review-footer-container">
                    <button
                        className="submit-review-button create-review-button"
                    >
                        Submit
                    </button>

                    <button
                        className="cancel-review-button create-review-button"
                    >
                        Cancel
                    </button>

                    <div className="create-review-error">
                        <FontAwesomeIcon icon={faCircleExclamation} style={{color: "#ff0000", marginRight: '3%'}} />
                        Errorfsdcvvcddddddddddddddddddddddddddddd
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ComposeReview;