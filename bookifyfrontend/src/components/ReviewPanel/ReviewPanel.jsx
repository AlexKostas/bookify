import ReviewCard from "../ReviewCard/ReviewCard";
import './reviewPanel.css';
import {Button, CircularProgress} from "@mui/material";
import useFetchItems from "../../hooks/useFetchItems";
import {useEffect, useRef, useState} from "react";

const ReviewPanel = ({ roomID }) => {
    const { availableItems: reviews, loading, refetch } = useFetchItems(
        `/reviews/getNReviews/${roomID}?N=2`,
        );

    const [reviewCount, setReviewCount] = useState(2);
    const [flag, setFlag] = useState(false);
    const step = 1;

    const containerRef = useRef();

    useEffect(() => {
        refetch(`/reviews/getNReviews/${roomID}?N=${reviewCount}`);
    }, [reviewCount]);

    const handleScroll = () => {
        const container = containerRef.current;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            console.log("Reached the end of reviews");
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if(!flag) return;

        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, [reviews]);

    return (
        <div className="review-panel-container" ref={containerRef}>
            <h1>Reviews</h1>
            <br/>

            {
                reviews.map( review => (
                    <ReviewCard review={review} />
                ))
            }

            <Button
                onClick={() => {
                    setReviewCount(reviewCount + step);
                    setFlag(true);
                }}
            >
                View More...
            </Button>

            {loading && <CircularProgress style={{width: '10%', height: '10%'}}/>}
        </div>
    );
}

export default ReviewPanel;