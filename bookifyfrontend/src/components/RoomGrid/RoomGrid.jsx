import axios from "../../api/axios";
import RoomCard from "../RoomCard/RoomCard";
import { useEffect, useState } from "react";
import './roomGrid.css';
import FilterPanel from "../FilterPanel/FilterPanel";
import PaginationControls from "../PaginationControls/PaginationControls";

const RoomGrid = ({endpointURL}) => {
  const itemsPerPage = 9;
  const [rooms, setRooms] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRooms = async (currentPage, orderDirection) => {
    try{
      const response = await axios.get(`${endpointURL}?pageNumber=${currentPage-1}&pageSize=${itemsPerPage}&orderDirection=${orderDirection}`);

      setRooms(response.data.content);
      setTotalPages(response.data.totalPages);
    }
    catch(error){
      console.log(error);
    }
  }

  const onPageChanged = (currentPage, orderDirection) => {
    fetchRooms(currentPage, orderDirection);
  }

  useEffect(() => {fetchRooms(1, 'ASC')}, []);

  return (
    <>
      {
        rooms.length === 0 ? <h3>No rooms found</h3> : (
          <div>
            <FilterPanel />
            <PaginationControls onPageChanged={onPageChanged} totalPages={totalPages}>
              <div className="room-grid">
                  {
                      rooms.map(room => (<RoomCard key={room.roomID} room={room} />))
                  }
              </div>
            </PaginationControls>
          </div>
        )
      }
    </>
  );
}

export default RoomGrid;