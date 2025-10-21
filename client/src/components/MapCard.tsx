import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";

interface MapCardProps {
  lat?: number;
  lng?: number;
  label?: string;
  mapLink?: string; // Add mapLink support
}

const MapCard: React.FC<MapCardProps> = ({
  lat = 14.5995, // default Manila
  lng = 120.9842,
  label = "Click map to open directions",
  mapLink, // Optional mapLink
}) => {
  const destination = { lat, lng };

  const handleOpenMaps = (): void => {
    // If mapLink is provided, use it directly
    if (mapLink) {
      window.open(mapLink, "_blank");
      return;
    }
    
    // Otherwise, use the default behavior with coordinates
    const isApple = /iPad|iPhone|Mac/i.test(navigator.userAgent);
    const link = isApple
      ? `http://maps.apple.com/?daddr=${destination.lat},${destination.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;
    window.open(link, "_blank");
  };

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div
      className="w-full h-[400px] bg-gray-400 rounded-3xl overflow-hidden relative cursor-pointer"
      onClick={handleOpenMaps}
    >
      <MapContainer
        center={destination}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={destination} icon={markerIcon}>
          <Popup>
            {mapLink ? (
              <div>
                <p>Click to open Google Maps</p>
                <a 
                  href={mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open directly
                </a>
              </div>
            ) : (
              label
            )}
          </Popup>
        </Marker>
      </MapContainer>

      <div className="absolute bottom-4 right-4 bg-white text-sm px-3 py-1 rounded-full shadow">
        {mapLink ? "Click to open Google Maps" : "Click to open directions"}
      </div>
    </div>
  );
};

export default MapCard;