import React, { useEffect } from 'react';
import './roomCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faBed } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../api/axios';
import { CircularProgress } from '@mui/material';

const RoomCard = ({room}) => {
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchImage = async (link) => {
        await axios.get(link, { responseType: 'blob' })
            .then(response => {
                const url = URL.createObjectURL(response.data);
                setLoading(false);
                setImageData(url);
            }
            
        )
        .catch(error => {
            console.error('Failed to fetch image:', error);
            setLoading(false);
            setImageData(null);
        });
    }

    useEffect(() => {
      if (!room.thumbnail) return;

      const url = `/roomPhotos/get/${room.thumbnail}`
      fetchImage(url);
    }, [room]);


    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
        <>
            {[...Array(fullStars)].map((_, index) => (
            <FontAwesomeIcon key={index} icon={faStar} />
            ))}
            {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} />}
            {[...Array(emptyStars)].map((_, index) => (
            <FontAwesomeIcon key={index} icon={faStar} className="empty-star" />
            ))}
            ({room.reviewCount})
        </>
        );
  };

  return (
    <Link to={`/room/${room.roomID}`} style={{ textDecoration: 'none' }}>
      <div className="room-card">
        {
          loading ? (<CircularProgress />) : 
            (<img src={imageData} alt={room.name} className="room-image" />)
        }
        <div className="room-details">
          <h3>{room.name}</h3>
          <div className="rating">{renderStars(room.rating)}</div>

          <div className='listing-info'>
            <p>
              {room.bedCount} <FontAwesomeIcon icon={faBed} />
            </p>
            <p>{room.roomType}</p>
          </div>
          <p>Price: ${room.price} per night</p>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;