import React from 'react';
import './roomCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const RoomCard = ({room}) => {

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
        </>
        );
  };

  return (
    <div className="room-card">
      <img src={room.image} alt={room.name} className="room-image" />
      <div className="room-details">
        <h3>{room.name}</h3>
        <div className="rating">{renderStars(room.rating)}</div>
        <p>Price: ${room.price} per night</p>
        {/* Add other room information here as needed */}
      </div>
    </div>
  );
};

export default RoomCard;
