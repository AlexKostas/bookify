import React, {useRef, useState} from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";

function MapInteraction() {
    const [clickedLatLng, setClickedLatLng] = useState(null);
    const [address, setAddress] = useState(null);
    const mapRef = useRef(null);
    function ClickHandler({ onMapClick }) {
        const map = useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                onMapClick(lat, lng);
            },
        });

        return null;
    }

    const handleMapClick = async (lat, lng) => {
        setClickedLatLng({ lat, lng });
        setAddress(null);

        try {
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
            const response = await axios.get(apiUrl);
            const data = response.data;
            const formattedAddress = data.display_name;
            setAddress(formattedAddress);
        } catch (error) {
            console.error('Error fetching address:', error);
        }

        mapRef.current.setView([lat, lng], mapRef.current.getZoom(), {
            animate: false,
        });

    };

    return (
        <div>
            <MapContainer
                ref={mapRef}
                center={[38.0742, 23.8243]}
                zoom={6}
                style={{ width: '45vh', height: '45vh' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <ClickHandler onMapClick={handleMapClick} />
                {clickedLatLng && (

                    <Marker
                        position={[clickedLatLng.lat, clickedLatLng.lng]}
                        icon={L.divIcon({
                            className: '',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            html: `<i class="fas fa-map-marker-alt" 
                            style="
                                font-size: 25px;
                                color: red;
                            "></i>`,
                        })}
                    />
                )}
            </MapContainer>

            {address && (
                <div>
                    <p>Latitude: {clickedLatLng.lat}</p>
                    <p>Longitude: {clickedLatLng.lng}</p>
                    <p>Address: {address}</p>
                </div>
            )}
        </div>
    );
}

export default MapInteraction;
