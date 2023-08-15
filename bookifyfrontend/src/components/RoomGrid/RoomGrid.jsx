import RoomCard from "../RoomCard/RoomCard";
import './roomGrid.css';

const RoomGrid = ({rooms}) => {

  return (
    <>
      {
        rooms.length === 0 ? <h3>No rooms found</h3> : (
          <div>

              <div className="room-grid">
                  {
                      rooms.map(room => (<RoomCard key={room.roomID} room={room} />))
                  }
              </div>

          </div>
        )
      }
    </>
  );
}

export default RoomGrid;