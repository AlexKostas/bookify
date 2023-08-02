import React, { useState, useRef, useEffect } from 'react';
import "./dropdown.css";
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import useImageFetcher from '../../hooks/useImageFetcher';

const Dropdown = ({username}) => {
    const dropdownRef = useRef();

    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
    const logout = useLogout();

    const profilePicURL = `/upload/getProfilePic/${username}`;
    const {imageData, loading} = useImageFetcher(profilePicURL);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleGoToProfile = () => navigate('/profile');

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="user-dropdown" ref={dropdownRef}>

            <button className="user-name" onClick={handleToggleDropdown}>
                {loading ? 
                    (<p>Loading...</p>) 
                    :imageData ? (
                        <img
                        src={imageData}
                        alt="Could not load profile picture"
                        className="profile-picture"
                        />) : username
                }
            </button>
            {isOpen && (
                <div className="dropdown-content">
                <button onClick={logout}>Sign Out</button>
                <button onClick={handleGoToProfile}>Go to Profile</button>
                </div>
            )}
        </div>
    );
};

export default Dropdown;