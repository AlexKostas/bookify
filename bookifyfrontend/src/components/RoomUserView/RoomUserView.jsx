import './roomUserView.css';
import {useNavigate} from "react-router-dom";
import useImageFetcher from "../../hooks/useImageFetcher";
import {Button, CircularProgress} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ChatIcon from '@mui/icons-material/Chat';
import StarIcon from '@mui/icons-material/Star';
import useFetchItems from "../../hooks/useFetchItems";
import {useEffect} from "react";
import Typography from "@mui/material/Typography";

const RoomUserView = ({ host }) => {
    const profilePicURL = `/upload/getProfilePic/${host}`;
    const userStatsURL = `/user/getUserStats/${host}`;

    const navigate = useNavigate();
    const { imageData, loading } = useImageFetcher(profilePicURL);
    const { availableItems: stats, refetch} = useFetchItems(userStatsURL);

    useEffect(() => {
        refetch(userStatsURL);
    }, [host])


    return (
        <div className='room-user-view-container'>
            <div className='room-user-view-content'>
                <Typography
                    variant="h1"
                    sx={{
                        color: 'white',
                        fontSize: '2rem'
                    }}
                >
                    Host
                </Typography>
                <hr style={{width: "90%",  margin: 'auto'}} />


                <button onClick={() => navigate(`/user/${host}`)} className="room-user-info">

                    {
                        loading ? <CircularProgress /> :
                            imageData &&
                            <Tooltip
                                title={"Click to visit host page"}
                                placement="top"
                                classes={{tooltip: 'centered-tooltip'}}
                                arrow
                            >
                                <img
                                    src={imageData}
                                    className="room-user-view-pic"
                                />
                            </Tooltip>
                    }

                    <Typography
                        variant="h3"
                        sx={{
                            color: 'white',
                            fontSize: '1.5rem'
                        }}
                    >
                        {host}
                    </Typography>

                    {
                        stats?.nHostReviews > 0 ?
                        <div className="user-rating-info">
                            Rating: {stats.hostRating.toFixed(1)} <StarIcon fontSize="small" style={{color: "yellow"}}/> ({stats.nHostReviews})
                        </div> : <span>No host reviews</span>
                    }
                </button>

                <button
                    onClick={() => navigate(`/messages/${host}`)}
                    className="room-message-button"
                >
                    Message Host
                    <ChatIcon />
                </button>

            </div>
        </div>
    )
}

export default RoomUserView;