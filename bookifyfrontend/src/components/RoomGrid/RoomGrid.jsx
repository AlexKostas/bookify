import axios from "../../api/axios";
import RoomCard from "../RoomCard/RoomCard";
import { useEffect, useState } from "react";
import './roomGrid.css';

const RoomGrid = ({endpointURL}) => {
  const itemsPerPage = 9;
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderDirection, setOrderDirection] = useState('ASC');

  const fetchRooms = async () => {
    try{
      const response = await axios.get(`${endpointURL}?pageNumber=${currentPage-1}&pageSize=${itemsPerPage}&orderDirection=${orderDirection}`);

      setRooms(response.data.content);
      setTotalPages(response.data.totalPages);
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, [currentPage])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const paginationRange = () => {
    const buttonsToShow = 10;
    const startPage = Math.max(1, currentPage - Math.floor(buttonsToShow / 2));
    const endPage = Math.min(totalPages, startPage + buttonsToShow - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <>
      <div className="room-grid">
          {
              rooms.map(room => (<RoomCard key={room.roomID} room={{...room, image: 'https://img.freepik.com/free-photo/green-sofa-white-living-room-with-free-space_43614-834.jpg?w=2000'}} />))
          }
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          First
        </button>

        {currentPage !== 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        )}

        {paginationRange().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
        {currentPage !== totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        )}

        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
          Last
        </button>
      </div>
    </>
  );
}

export default RoomGrid;