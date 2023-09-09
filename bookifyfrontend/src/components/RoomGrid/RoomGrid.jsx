import RoomCard from "../RoomCard/RoomCard";
import './roomGrid.css';
import {CircularProgress} from "@mui/material";

const RoomGrid = ({rooms, loading}) => {

  return (
    <>
      {
        (rooms.length === 0 && !loading) ? <h3>No rooms found</h3> : (
          <div>

            {
              loading ?
                  <div className="room-grid-progress-container">
                    <CircularProgress size={70} className="room-grid-progress" />
                  </div> :

                  <div className="room-grid">
                    {
                      rooms.map(room => (<RoomCard key={room.roomID} room={room} />))
                    }
                  </div>
            }

          </div>
        )
      }
    </>
  );
}

export default RoomGrid;