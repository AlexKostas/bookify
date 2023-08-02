import RoomCard from "../RoomCard/RoomCard";
import './roomGrid.css';

const RoomGrid = ({rooms=[]}) => {
  return (
    <div className="room-grid">
        {
            rooms.map(room => (<RoomCard room={room} />))
        }
    </div>
  );
}

export default RoomGrid;