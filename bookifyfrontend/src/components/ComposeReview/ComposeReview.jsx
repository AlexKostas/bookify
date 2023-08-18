import './composeReview.css';
import {useEffect, useState} from "react";
import Rating from "@mui/material/Rating";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CreateReviewError = ({ content }) => {
    return (
        <div className="create-review-error">
            {
                content !== '' &&
                <FontAwesomeIcon icon={faCircleExclamation} style={{color: "#ff0000", marginRight: '3%'}}/>
            }
            {content}
        </div>
    )
}

const ComposeReview = ({onSubmit, onClose, roomID, review}) => {
    const maxCommentLength = 1500;

    const [rating, setRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [error, setError] = useState('');

    const axiosPrivate = useAxiosPrivate();

    const maxLengthReached = reviewComment.length >= maxCommentLength;

    const handleSubmit = async () => {
        if(rating === 0){
            setError('You need to set a rating first');
            return;
        }

        const body = JSON.stringify({
            stars: rating,
            comment: reviewComment
        });

        try {
            review ? await axiosPrivate.put(`/reviews/editReview/${review.reviewID}`, body) :
                await axiosPrivate.post(`/reviews/createReview/${roomID}`, body);

            if(onSubmit) onSubmit();
        }
        catch (e){
            console.log(e);

            if (!e?.response)
                setError('No connection to the server');
            else if (e.response?.status === 400)
                setError('Bad request. Check the console for more details')
            else if (e.response?.status === 404)
                setError(`Room with id ${roomID} not found`);
            else
                setError('An error occurred, check the console for more details');
        }
    }

    useEffect(() => {
        if(!review) return;

        setRating(review.stars);
        setReviewComment(review.comment);
    }, [review]);

    return (
        <div className="review-card-container">  {/*from reviewCard.css*/}
            <div className="compose-review-content">
                <h2>New Review</h2>

                <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(event, newValue) => {
                        setError('')
                        setRating(newValue);
                    }}
                    style={{ marginTop: '-3%', marginBottom: '1%' }}
                />

                <textarea
                    value={reviewComment}
                    onChange={(e) => {
                        setReviewComment(e.target.value);
                        setError('')
                    }}
                    required
                    placeholder="Type your comment here..."
                    maxLength={maxCommentLength}
                    className={`review-comment-input ${maxLengthReached && 'text-area-maxed-out'} `}
                />

                <div className="review-footer-container">
                    <button
                        className="submit-review-button create-review-button"
                        onClick={() => handleSubmit()}
                    >
                        Submit
                    </button>

                    <button
                        onClick={() => {
                            if(onClose) onClose();
                        }}
                        className="cancel-review-button create-review-button"
                    >
                        Cancel
                    </button>

                    {
                        error !== '' ? <CreateReviewError content={error} />
                            : maxLengthReached &&
                        maxLengthReached &&
                            <CreateReviewError content={`Maximum comment length: ${maxCommentLength} characters`} />
                    }

                </div>

            </div>
        </div>
    )
}

export default ComposeReview;