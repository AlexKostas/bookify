import { Grid, Typography } from '@mui/material';
import React, {useEffect, useState} from "react";
import axios from "../../api/axios";
import './roomview.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const RoomView = ({ roomID }) => {
    const ROOM_URL = `/room/getRoom/${roomID}`;

    const [room, setRoom] = useState(null)
    const latitude = parseFloat(room?.latitude);
    const longitude = parseFloat(room?.longitude);

    const label = "House"
    const customIcon = L.icon({
        iconUrl: 'https://icon-library.com/images/marker-icon-png/marker-icon-png-6.jpg',
        iconSize: [34, 39],
        iconAnchor: [16, 32],
    });

    const fetchRoomDetails = async () => {
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

    };


    useEffect(() => {
        fetchRoomDetails();
    }, [roomID]);

    return (
        <>
            <div className="user-info">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body1">Number of Beds: {room?.nBeds}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Number of Baths: {room?.nBaths}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Number of Bedrooms: {room?.nBedrooms}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Total surface area: {room?.surfaceArea}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Description: {room?.description}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Amenities: {room?.amenityNames}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Amenity Description: {room?.amenityDescriptions}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Thumbnail Photo: {room?.thumbnailGuid}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Latitude: {latitude}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Longitude: {longitude}</Typography>
                    </Grid>
                </Grid>
            </div>

            {latitude && longitude && (
                <MapContainer center={[latitude, longitude]} zoom={16} style={{ height: '400px', width: '100%' }}>
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
        </>
    );
}

export default RoomView;