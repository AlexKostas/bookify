import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './createRoomSteps.css';
import L, { icon } from 'leaflet';

const CreateRoomSteps = () => {

  const [latitude, setLatitude] = useState(39.065529);
  const [longitude, setLongitude] = useState(20.689636);

  const label = "House"

  const customIcon = L.icon({
    iconUrl: 'https://icon-library.com/images/marker-icon-png/marker-icon-png-6.jpg',
    iconSize: [34, 39], 
    iconAnchor: [16, 32], 
  });

  return (
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
  );
};

export default CreateRoomSteps;
