import RoomCard from "../RoomCard/RoomCard";
import './roomGrid.css';
import {CircularProgress} from "@mui/material";
import Typography from "@mui/material/Typography";

const RoomGrid = ({rooms, loading}) => {

  return (
    <>
      {
        (rooms.length === 0 && !loading) ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                  variant="h3"
                  sx={{
                    paddingTop: "1.5rem",
                    fontSize: "1.3rem",
                    color: "#333",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                  }}
              >
                No rooms found for given options
              </Typography>
            </div>
          ) : (
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