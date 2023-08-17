import ReviewCard from "../ReviewCard/ReviewCard";
import './reviewPanel.css';
import {CircularProgress} from "@mui/material";
import useFetchItems from "../../hooks/useFetchItems";
import {useEffect, useState} from "react";

const ReviewPanel = ({ roomID }) => {
    const { availableItems: reviews, loading, refetch } = useFetchItems(`/reviews/getNReviews/${roomID}?N=3`);
    const [ reviewCount, setReviewCount] = useState(2);

    useEffect(() => {
        refetch();
    }, [reviewCount]);

    return (
        <div className="review-panel-container">
            <h1>Reviews</h1>
            <br/>

            {
                reviews.map( review => (
                    <ReviewCard review={review} />
                ))
            }

            {loading && <CircularProgress style={{width: '10%', height: '10%'}}/>}
        </div>
    );
}

export default ReviewPanel;