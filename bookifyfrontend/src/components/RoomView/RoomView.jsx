import { Grid, Typography } from '@mui/material';
import { useCallback } from 'react'
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
        fetchRoomDetails();
    }, [fetchRoomDetails]);

    return (
        <>
            <div className="user-info">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body2">Host: {room?.hostUsername}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Summary: {room?.summary}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Description: {room?.description}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Number of Beds: {room?.nBeds}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Number of Baths: {room?.nBaths}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Number of Bedrooms: {room?.nBedrooms}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Total surface area: {room?.surfaceArea}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Amenities: {room?.amenityNames}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Amenity Description: {room?.amenityDescriptions}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Thumbnail Photo: {room?.thumbnailGuid}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Country: {room?.country}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">City: {room?.city}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Address: {room?.address}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Neighborhood: {room?.state}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Transit Info: {room?.zipcode}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Room Type: {room?.roomType}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Price per night (eur): {room?.pricePerNight}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Maximum number of tenants: {room?.maxTenants}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Extra cost per tenant: {room?.extraCostPerTenant}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">
                            Amenities:
                            <div>
                                {room?.amenityNames.map(amenity => {
                                    return(
                                        <div key={amenity.id}>
                                            {amenity}
                                        </div>
                                    );
                                })}
                            </div>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">
                            Amenities' Descriptions:
                            <div>
                                {room?.amenityDescriptions.map(amenityDescr => {
                                    return(
                                        <div key={amenityDescr.id}>
                                            {amenityDescr}
                                        </div>
                                    );
                                })}
                            </div>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Thumbnail: {room?.thumbnailGuid}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">
                            Photo Guids:
                            <div>
                                {room?.photosGUIDs.map(photoGUID => {
                                    return(
                                        <div key={photoGUID.id}>
                                            {photoGUID}
                                        </div>
                                    );
                                })}
                            </div>
                        </Typography>
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