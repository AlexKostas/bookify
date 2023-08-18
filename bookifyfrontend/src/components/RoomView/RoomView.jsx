import {useCallback, useEffect} from 'react'
import {useState} from "react";
import axios from "../../api/axios";
import './roomview.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ReviewPanel from "../ReviewPanel/ReviewPanel";
import RoomUserView from "../RoomUserView/RoomUserView";
import Tooltip from "@mui/material/Tooltip";
import BookingPanel from "../BookingPanel/BookingPanel";
import StarIcon from "@mui/icons-material/Star";
import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';
import useImageFetcher from "../../hooks/useImageFetcher";

const RoomView = ({ roomID }) => {
    const ROOM_URL = `/room/getRoom/${roomID}`;

    const [room, setRoom] = useState({});
    const [shouldRedraw, setShouldRedraw] = useState(true); // MUST BE INITIALIZED TO TRUE

    const profilePicURL = `/upload/getProfilePic/${room.hostUsername}`;
    const { imageData } = useImageFetcher(profilePicURL);

    const latitude = parseFloat(room?.latitude);
    const longitude = parseFloat(room?.longitude);

    const label = "House"
    const customIcon = L.icon({
        iconUrl: 'https://icon-library.com/images/marker-icon-png/marker-icon-png-6.jpg',
        iconSize: [34, 39],
        iconAnchor: [16, 32],
    });

    const capitalizeWords = (str) =>
        str
            .split(/\s+/)
            .map(word =>
                word
                    .split('-')
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                    .join('-')
            )
            .join(' ');

    const fetchRoomDetails = useCallback(async () => {
        if (room === '') {
            setRoom(null);
            return;
        }

        try {
            const response = await axios.get(ROOM_URL);
            setRoom(response?.data ?? null);
        } catch (error) {
            console.log(error);
            setRoom(null);
        }
    }, [ROOM_URL, room]);

    useEffect(() => {
        if(!shouldRedraw) return;

        fetchRoomDetails();
        setShouldRedraw(false);
    }, [shouldRedraw]);

    return (
        <div className="room-view-container">

            <div className="general-room-info">
                <h2>{room.name}</h2>

                {
                    room &&
                    <div className="room-info-items">

                        <Link
                            to={`/user/${room.hostUsername}`}
                            className="room-info-host">
                            <img
                                src={imageData}
                                className='room-info-profile-pic'
                            />
                            <u>{room.hostUsername}</u>
                        </Link>

                        <div className="room-info-reviews">
                            <StarIcon fontSize="small" style={{color: "yellow"}}/> {room.rating?.toFixed(1)} · <ScrollLink
                            to="reviews"
                            smooth={true}
                            duration={500}
                        >
                            <u className="review-link">{room.reviewCount} review{room.reviewCount > 1 && 's'}</u>
                        </ScrollLink>
                        </div>

                        <div className="room-info-location">
                            <ScrollLink
                                to="location"
                                smooth={true}
                                duration={500}
                            >
                                <u className="review-link">{capitalizeWords(room?.neighborhood ?? '')}, {room.city}, {room.state}, {room.country}</u>
                            </ScrollLink>
                        </div>

                    </div>
                }

            </div>

            <div className="centered-container" >

                <div className="room-view-images">

                    <img
                        src='data:image/jpeg;base64,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'
                    />

                </div>

                <div className="main-content-parent">

                    <div className="main-room-content" >

                        <section className="room-section">
                            <h3 className="room-section-title">Summary</h3>
                            {room?.summary ? (
                                <p>{room.summary}</p>
                            ) : (
                                <p>No summary provided</p>
                            )}
                        </section>

                        <section className="room-section">
                            <h3 className="room-section-title">Description</h3>
                            {room?.description ? (
                                <p>{room.description}</p>
                            ) : (
                                <p>No description provided</p>
                            )}
                        </section>

                        <section className="room-section">
                            <h3 className="room-section-title">Space</h3>
                            <ul>
                                <ul>
                                    <li>Bedrooms: {room?.nBedrooms ? room.nBedrooms : "—"}</li>
                                    <li>Beds: {room?.nBeds ? room.nBeds : "—"}</li>
                                    <li>Bathrooms: {room?.nBaths ? room.nBaths : "—"}</li>
                                    <li>Total surface area: {room?.surfaceArea ? `${room.surfaceArea} sq. feet` : "—"}</li>
                                    <li>Room Type: {room?.roomType ? room.roomType : "—"}</li>
                                    <li>Maximum number of tenants: {room?.maxTenants ? room.maxTenants : "—"}</li>
                                    <li>Number of accommodates: {room?.accommodates ? room.accommodates : "—"}</li>
                                </ul>
                            </ul>
                        </section>

                        <section className="room-section" id={"location"}>
                            <h3 className="room-section-title">Location</h3>
                            <div className="room-view-map-container">
                                {latitude && longitude && (
                                    <MapContainer
                                        center={[latitude, longitude]}
                                        zoom={16}
                                        className="room-view-map"
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[latitude, longitude]} icon={customIcon}>
                                            <Popup>
                                                {label && (
                                                    <div style={{  maxWidth: '200px' }}>
                                                        <div style={{ fontWeight: 'bold' }}>{label}</div>
                                                        <div>
                                                            Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}
                                                        </div>
                                                    </div>
                                                )}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                )}
                            </div>
                            <ul>
                                <li>Address: {room?.address ? room.address : "No address provided"}</li>
                                <li>City: {room?.city ? room.city : "No city provided"}</li>
                                <li>State: {room?.state ? room.state : "No state provided"}</li>
                                <li>Country: {room?.country ? room.country : "No country provided"}</li>
                                <li>Zipcode: {room?.zipcode ? room.zipcode : "No zipcode provided"}</li>
                            </ul>
                        </section>


                        <section className="room-section">
                            <h3 className="room-section-title">Neighborhood</h3>
                                <h4>{room?.neighborhood ? room.neighborhood : "No neighborhood provided"}</h4>
                                {room?.neighborhoodOverview ? (
                                    <p>{room.neighborhoodOverview}</p>
                                ) : (
                                    <p>No neighborhood overview provided</p>
                                )}
                        </section>

                        <section className="room-section">
                            <h3 className="room-section-title">Transit Info</h3>
                            {room?.transitInfo ? (
                                <p>{room.transitInfo}</p>
                            ) : (
                                <p>No transit information provided</p>
                            )}
                        </section>

                        <section className="room-section">
                            <h3 className="room-section-title">Amenities</h3>
                            <div>
                                {room?.amenityNames && room.amenityNames.length > 0 ? (
                                <ul>
                                    {room.amenityNames.map((amenity, index) => (
                                        <li key={index}>
                                            {room.amenityDescriptions[index] ? (
                                                <Tooltip
                                                    title={room.amenityDescriptions[index]}
                                                    placement="right"
                                                    classes={{ tooltip: 'centered-tooltip' }}
                                                    arrow
                                                >
                                                    {amenity}
                                                </Tooltip>
                                            ) : (
                                                amenity
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                ) : (
                                    <p>No amenities' information provided</p>
                                )}
                            </div>
                        </section>

                        <section className="room-section">
                            <h3 className="room-section-title">Rules</h3>
                            {room?.rules ? (
                                <p>{room.rules}</p>
                            ) : (
                                <p>No rules provided</p>
                            )}
                        </section>

                        <section className="room-section">
                            <h3 className="room-section-title">Notes</h3>
                            {room?.notes ? (
                                <p>{room.notes}</p>
                            ) : (
                                <p>No notes</p>
                            )}
                        </section>

                    </div>

                    <div className="room-view-side-panel">
                        <BookingPanel />
                        <RoomUserView host={room.hostUsername} />
                    </div>

                </div>

                <div className="review-parent" id="reviews">

                    <ReviewPanel
                        roomID={roomID}
                        maxReviews={room.reviewCount}
                        onReviewsChanged={() => setShouldRedraw(true)}
                    />

                </div>
            </div>


        </div>

    );
}

export default RoomView;