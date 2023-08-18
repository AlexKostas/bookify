import ReviewCard from "../ReviewCard/ReviewCard";
import './reviewPanel.css';
import {Button, CircularProgress} from "@mui/material";
import useFetchItems from "../../hooks/useFetchItems";
import {useEffect, useRef, useState} from "react";
import ComposeReview from "../ComposeReview/ComposeReview";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ReviewPanel = ({ roomID, maxReviews, onReviewsChanged }) => {
    const [reviewCount, setReviewCount] = useState(4);
    const [flag, setFlag] = useState(false);
    const [composeActive, setComposeActive] = useState(false);
    const [usersReview, setUsersReview] = useState(null);
    const [nextReview, setNextReview] = useState(0);

    const axiosPrivate = useAxiosPrivate();

    const { availableItems: reviews, loading, refetch } = useFetchItems(
        `/reviews/getNReviews/${roomID}?N=${reviewCount}`,
    );

    const step = 4;

    const containerRef = useRef();

    const { auth } = useAuth();
    const canReview = auth && auth.roles.includes('tenant');

    const fetchUsersReview = async () => {
        if(!canReview) return;

        try{
            const response = await axiosPrivate.get(`/reviews/getReviewOfUser/${roomID}`);
            setUsersReview(response.data);
        }
        catch(error){
            if(error.response?.status === 404) setUsersReview(null);
        }
    }

    const deleteReview = async (reviewID) => {
        if(!canReview) return;

        try {
            await axiosPrivate.delete(`reviews/deleteReview/${reviewID}`);
            refetch(`/reviews/getNReviews/${roomID}?N=${reviewCount}`);
            fetchUsersReview();
            if(onReviewsChanged) onReviewsChanged();
        }
        catch (error){
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsersReview();
    }, [roomID]);


    useEffect(() => {
        refetch(`/reviews/getNReviews/${roomID}?N=${reviewCount}`);
    }, [reviewCount]);

    const handleScroll = () => {
        const container = containerRef.current;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            console.log("Reached the end of reviews");
        }
    };

    const scrollToDiv = (elementID) => {
        const targetElement = document.getElementById(elementID);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start', // Scroll to the top of the element
            });
        }
    }

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if(!flag) return;

        scrollToDiv(`${nextReview}`);
    }, [reviews]);

    return (
        <div className="review-panel-container" ref={containerRef}>
            <h1>Reviews ({maxReviews})</h1>

            {
                composeActive ?
                    <ComposeReview
                        onSubmit={() => {
                            setComposeActive(false);
                            if(onReviewsChanged) onReviewsChanged();
                            fetchUsersReview();
                        }}
                        onClose={() => setComposeActive(false)}
                        roomID={roomID}
                        review={usersReview}
                    />
                    : usersReview ?
                        <div className="your-review-container">
                            <h2>Your Review</h2>
                            <ReviewCard
                                review={usersReview}
                                usersReview={true}
                                onEdit={() => {
                                    setComposeActive(true);
                                }}
                                onDelete={deleteReview}
                            />

                        </div>

                        : <button
                            onClick={() => setComposeActive(true)}
                            className="add-review-button"
                            disabled={!canReview}
                        >
                            {!auth ? 'Login to submit a review' : (canReview ? 'Add your review' : 'You need to be a tenant to add a review')}
                        </button>
            }

            <div id="reviewStart" >
                {
                    reviews.map( (review, index) => (
                        (!auth || auth.user !== review.username) && <div id={`${index}`}><ReviewCard review={review} /></div>
                    ))
                }
            </div>

            {
                reviews.length > 0 ?
               (
                   <>
                   <br/>

                   {
                      reviewCount < maxReviews && (
                           <div>
                               <Button
                                   onClick={() => {
                                       setNextReview(reviewCount);
                                       setReviewCount(reviewCount + step);
                                       setFlag(true);
                                   }}
                               >
                                   View More...
                               </Button>
                           </div>
                       )
                   }

                   <Button onClick={() => scrollToDiv('reviewStart')}>Go to first review</Button>

                   </>
                   )
                     :  <h3>No reviews</h3>
            }

            {loading && <CircularProgress style={{width: '10%', height: '10%'}}/>}
        </div>
    );
}

export default ReviewPanel;