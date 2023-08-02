import React, { useState, useRef, useEffect } from 'react';
import "./dropdown.css";
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import axios from '../../api/axios';

const Dropdown = ({username}) => {
    const dropdownRef = useRef();

    const [isOpen, setIsOpen] = useState(false);
    const [profilePic, setProfilePic] = useState(null);

    const navigate = useNavigate();
    const logout = useLogout();

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

    useEffect(() => {
        if(!username) return;

        axios.get(`/upload/getProfilePic/${username}`, { responseType: 'blob' })
            .then(response => {
            const url = URL.createObjectURL(response.data);
            setProfilePic(url);
        })
        .catch(error => {
            console.error('Failed to fetch image:', error);
        });
        
    }, [username]);

    return (
        <div className="user-dropdown" ref={dropdownRef}>

            <button className="user-name" onClick={handleToggleDropdown}>
                {profilePic ? (
                    <img
                    src={profilePic}
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
