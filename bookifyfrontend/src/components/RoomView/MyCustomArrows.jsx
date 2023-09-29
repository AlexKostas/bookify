import React from 'react';

const MyCustomArrows = ({ direction, onClick }) => (
    <button
        onClick={onClick}
        style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'darkgray', // Background color
            borderRadius: '50%', // Makes it a circle
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1, // Ensures it's above the carousel content
            cursor: 'pointer',
        }}
    >
        <i
            className={`fas fa-arrow-${direction}`} // Use the appropriate icon class here
            style={{
                fontSize: '20px', // Adjust the icon size
                color: 'dodgerblue', // Arrow color
            }}
        ></i>
    </button>
);

export default MyCustomArrows;