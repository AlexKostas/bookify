import React, {useEffect, useRef, useState} from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";
import './mapInteraction.css'

function MapInteraction({ onClick, initValues }) {
    const [clickedLatLng, setClickedLatLng] = useState(null);
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

        try {
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            const number = data.address.house_number || '';
            const street = data.address.road || '';
            const city = data.address.suburb || data.address.town || data.address.village || data.address.city;

            const formattedAddress = `${street} ${number}, ${city}`;

            if(onClick){
                onClick(
                    lat,
                    lng,
                    formattedAddress,
                    data.address.neighbourhood,
                    city,
                    data.address.state,
                    data.address.country,
                    data.address.postcode)
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }

        mapRef.current.setView([lat, lng], mapRef.current.getZoom(), {
            animate: true,
        });

    };

    useEffect(() => {
        if(initValues) setClickedLatLng(initValues)
    }, [initValues]);

    return (
            <MapContainer
                ref={mapRef}
                center={[38.0742, 23.8243]}
                zoom={initValues ? 14 : 6}
                className="room-view-map room-edit-map"

            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; Map data provided by <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <ClickHandler onMapClick={handleMapClick} />
                {clickedLatLng && (

                    <Marker
                        position={[clickedLatLng.lat, clickedLatLng.lng]}
                        icon={L.divIcon({
                            className: '',
                            iconSize: [25, 41],
                            iconAnchor: [7, 22],
                            html: `<i class="fas fa-map-marker-alt" 
                            style="
                                font-size: 25px;
                                color: red;
                            "></i>`,
                        })}
                    />
                )}
            </MapContainer>
    );
}

export default MapInteraction;