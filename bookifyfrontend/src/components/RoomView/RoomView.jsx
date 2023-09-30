import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {useCallback, useEffect, useState} from 'react'
import axios from "../../api/axios";
import './roomview.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import ReviewPanel from "../ReviewPanel/ReviewPanel";
import RoomUserView from "../RoomUserView/RoomUserView";
import Tooltip from "@mui/material/Tooltip";
import BookingPanel from "../BookingPanel/BookingPanel";
import StarIcon from "@mui/icons-material/Star";
import {Link as ScrollLink} from 'react-scroll';
import {Link} from 'react-router-dom';
import useImageFetcher from "../../hooks/useImageFetcher";
import {CircularProgress} from "@mui/material";
import useFetchImages from "../../hooks/useFetchImages";
import Typography from "@mui/material/Typography";
import './customCarouselStyles.css'

const RoomView = ({ roomID }) => {
    const ROOM_URL = `/room/getRoom/${roomID}`;

    const [room, setRoom] = useState({});
    const [shouldRedraw, setShouldRedraw] = useState(true); // MUST BE INITIALIZED TO TRUE
    const [images, setImages] = useState([]);

    const profilePicURL = `/upload/getProfilePic/${room?.hostUsername}`;
    const { imageData } = useImageFetcher(profilePicURL);
    const { fetchImages, loading } = useFetchImages();

    const latitude = parseFloat(room?.latitude);
    const longitude = parseFloat(room?.longitude);

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

    const downloadImages = async () => {
        let urls = [`/roomPhotos/get/${room?.thumbnailGuid}`]
        urls = [...urls, ...room?.photosGUIDs.map(item => `/roomPhotos/get/${item}`)];
        const downloadedImages = await fetchImages(urls);
        setImages(downloadedImages || []);
    }


    useEffect(() => {
        if(!room || !room?.photosGUIDs) return;

        downloadImages();
    }, [room]);

    useEffect(() => {
        if(!shouldRedraw) return;

        fetchRoomDetails();
        setShouldRedraw(false);
    }, [shouldRedraw]);

    return (
        <div className="room-view-container">

            <div className="general-room-info" id="view-room-start">
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: "1.7rem",
                        color: "#333",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {room?.name}
                </Typography>

                {
                    room &&
                    <div className="room-info-items">

                        <Link
                            to={`/user/${room?.hostUsername}`}
                            className="room-info-host">
                            <img
                                src={imageData}
                                className='room-info-profile-pic'
                            />

                            <u className="room-info-host">{room?.hostUsername}</u>
                        </Link>

                        <div className="room-info-reviews">
                            <span className="star-icon">
                                <StarIcon fontSize="small" style={{color: "black"}}/>
                            </span>
                            {room.rating?.toFixed(1)} ·
                            <ScrollLink
                                to="reviews"
                                smooth={true}
                                duration={500}
                            >
                            <u className="review-link">{room?.reviewCount} review{(room?.reviewCount > 1 || room?.reviewCount <= 0) && 's'}</u>
                            </ScrollLink>
                        </div>

                        <div className="room-info-location">
                            <ScrollLink
                                to="location"
                                smooth={true}
                                duration={500}
                            >
                                <u className="review-link">{capitalizeWords(room?.neighborhood ?? '')}, {room?.city}, {room?.state}, {room?.country}</u>
                            </ScrollLink>
                        </div>

                    </div>
                }

            </div>

            <div className="centered-container" >

                <div className="view-main">

                    <div className="room-view-images">

                        {
                            loading ? <CircularProgress size={100} /> :
                                <div className="box">
                                    <Carousel
                                        useKeyboardArrows={true}
                                    >
                                        {images.map((URL, index) => (
                                            <div className="slide">
                                                <img className="slide-item" alt="sample_file" src={URL} key={index} />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                        }

                    </div>

                    <div className="main-content-parent">

                        <div className="main-room-content" >

                            <section className="room-section">
                                <h3 className="room-section-title">Summary</h3>
                                {room?.summary ? (
                                    <p>{room?.summary}</p>
                                ) : (
                                    <p>No summary provided</p>
                                )}
                            </section>

                            <section className="room-section">
                                <h3 className="room-section-title">Description</h3>
                                {room?.description ? (
                                    <p>{room?.description}</p>
                                ) : (
                                    <p>No description provided</p>
                                )}
                            </section>

                            <section className="room-section">
                                <h3 className="room-section-title">Space</h3>
                                <ul>
                                    <ul>
                                        <li>Bedrooms: {room?.nBedrooms ? room?.nBedrooms : "—"}</li>
                                        <li>Beds: {room?.nBeds ? room?.nBeds : "—"}</li>
                                        <li>Bathrooms: {room?.nBaths ? room?.nBaths : "—"}</li>
                                        <li>Total surface area: {room?.surfaceArea ? `${room?.surfaceArea} sq. feet` : "—"}</li>
                                        <li>Room type: {room?.roomType ? room?.roomType : "—"}</li>
                                        <li>Maximum number of tenants: {room?.maxTenants ? room?.maxTenants : "—"}</li>
                                        <li>Number of accommodates: {room?.accommodates ? room?.accommodates : "—"}</li>
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
                                                    {room?.name && (
                                                        <div style={{  maxWidth: '200px', textAlign: 'center' }}>
                                                            <div style={{ fontWeight: 'bold' }}>{room?.name}</div>
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
                                    <li>Address: {room?.address ? room?.address : "No address provided"}</li>
                                    <li>City: {room?.city ? room?.city : "No city provided"}</li>
                                    <li>State: {room?.state ? room?.state : "No state provided"}</li>
                                    <li>Country: {room?.country ? room?.country : "No country provided"}</li>
                                    <li>Zipcode: {room?.zipcode ? room?.zipcode : "No zipcode provided"}</li>
                                </ul>
                            </section>


                            <section className="room-section">
                                <h3 className="room-section-title">Neighborhood</h3>
                                <h4>{room?.neighborhood ? room?.neighborhood : "No neighborhood provided"}</h4>
                                {room?.neighborhoodOverview ? (
                                    <p>{room?.neighborhoodOverview}</p>
                                ) : (
                                    <p>No neighborhood overview provided</p>
                                )}
                            </section>

                            <section className="room-section">
                                <h3 className="room-section-title">Transit Info</h3>
                                {room?.transitInfo ? (
                                    <p>{room?.transitInfo}</p>
                                ) : (
                                    <p>No transit information provided</p>
                                )}
                            </section>

                            <section className="room-section">
                                <h3 className="room-section-title">Amenities</h3>
                                <div>
                                    {room?.amenityNames && room?.amenityNames.length > 0 ? (
                                        <ul>
                                            {room?.amenityNames.map((amenity, index) => (
                                                <li key={index}>
                                                    {room?.amenityDescriptions[index] ? (
                                                        <Tooltip
                                                            title={room?.amenityDescriptions[index]}
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
                                    <p>{room?.rules}</p>
                                ) : (
                                    <p>No rules provided</p>
                                )}
                            </section>

                            <section className="room-section">
                                <h3 className="room-section-title">Notes</h3>
                                {room?.notes ? (
                                    <p>{room?.notes}</p>
                                ) : (
                                    <p>No notes</p>
                                )}
                            </section>

                        </div>

                        <div className="room-view-side-panel">
                            <BookingPanel roomID={roomID} room={room} />
                            <RoomUserView host={room?.hostUsername} />
                        </div>

                    </div>

                </div>

                <div className="back-to-top">
                    <ScrollLink
                        to="view-room-start"
                        smooth={true}
                        duration={500}
                    >
                        <u className="back-to-top-link">Back to top</u>
                    </ScrollLink>
                </div>

                <div className="review-parent" id="reviews">

                    <ReviewPanel
                        roomID={roomID}
                        maxReviews={room?.reviewCount}
                        onReviewsChanged={() => setShouldRedraw(true)}
                        roomHost={room?.hostUsername}
                    />

                </div>
            </div>


        </div>

    );
}

export default RoomView;