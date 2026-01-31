import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
// We need to import the images explicitly to work with Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MapSection = ({ location, name }) => {
    // Default to Addis Ababa if no location
    const isLatAndLogProvided = location && location.lat && location.lng && location.lat != '' && location.lng != ''
    const position = isLatAndLogProvided ? [location.lat, location.lng] : [9.03, 38.74];

    return (
        <div style={{ height: '350px', width: '100%', marginTop: '2rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                        {name || "Location"}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapSection;
