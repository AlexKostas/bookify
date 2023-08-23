import React, { useState, useRef, useEffect } from 'react';
import "./dropdown.css";
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import useImageFetcher from '../../hooks/useImageFetcher';
import useAuth from '../../hooks/useAuth';
import useAutoFetchMessages from "../../hooks/useAutoFetchMessages";

const Dropdown = ({username, image}) => {
    const dropdownRef = useRef();
    const { auth } = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
    const logout = useLogout();

    const profilePicURL = `/upload/getProfilePic/${username}`;
    const {imageData, loading, setImageData} = useImageFetcher(profilePicURL);

    const unreadMessages = useAutoFetchMessages();

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
        if(image) setImageData(image);
    }, [image]);

    return (
        <div className="user-dropdown" ref={dropdownRef}>

            <button className="user-name" onClick={handleToggleDropdown}>
                {loading ? 
                    (<p>Loading...</p>) 
                    :imageData ? (
                        <div className="dropdown-profile-container">
                            <img
                            src={imageData}
                            alt="Could not load profile picture"
                            className="profile-picture"
                            />

                            {(unreadMessages > 0 && !isOpen) && <div className="unread-dot"></div>}
                        </div>
                    ) : username
                }
            </button>
            {isOpen && (
                <div className="dropdown-content">
                <p style={{ textAlign: 'center', color: 'darkblue', marginTop: '20px' }}>{username}</p>
                <hr style={{ width: '90%', margin: 'auto' }} />
                <button onClick={() => logout(false)}>Sign Out</button>
                <button onClick={() => logout(true)}>Switch account</button>
                {
                    auth.roles.includes('admin') && (
                        <button onClick={() => navigate('/admin')}>Admin Dashboard</button>
                    )
                }
                {
                    (auth.roles.includes('host') || auth.roles.includes('inactive-host')) && (
                        <button onClick={() => navigate('/host')}>Host Dashboard</button>
                    )
                }
                {
                    (auth.roles.includes('host') || auth.roles.includes('inactive-host') || auth.roles.includes('tenant') || auth.roles.includes('admin')) && (
                        <button
                            style={{
                                color: unreadMessages > 0 ? 'red' : 'black',
                            }}
                            onClick={() => navigate('/messages')}
                        >
                            Messages {unreadMessages > 0 ? `(${unreadMessages})` : ''}
                        </button>
                    )
                }
                <button onClick={handleGoToProfile}>Profile</button>
                </div>
            )}
        </div>
    );
};

export default Dropdown;