import { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PendingLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  marker?: any;
}

interface StoreLocationPickerProps {
  onLocationsChange?: (
    locations: {
      name: string;
      latitude: number;
      longitude: number;
      // Removed micrositeId since it will be added later
    }[]
  ) => void;
}

export default function StoreLocationPicker({
  onLocationsChange,
}: StoreLocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [storeName, setStoreName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [pendingLocations, setPendingLocations] = useState<PendingLocation[]>(
    []
  );

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Load Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = (window as any).L;
      const map = L.map(mapRef.current).setView([12.8797, 121.774], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      map.on("click", (e: any) => {
        setSelectedLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });

        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        markerRef.current = L.marker([e.latlng.lat, e.latlng.lng])
          .addTo(map)
          .bindPopup("Click 'Add Location' to save")
          .openPopup();
      });

      leafletMapRef.current = map;
    };
    document.body.appendChild(script);
  }, []);

  // Notify parent when locations change
  useEffect(() => {
    if (onLocationsChange) {
      const locations = pendingLocations.map((loc) => ({
        name: loc.name,
        latitude: loc.lat,
        longitude: loc.lng,
      }));
      onLocationsChange(locations);
    }
  }, [pendingLocations, onLocationsChange]);

  const handleSearchClick = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const results = await response.json();

      if (results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lng = parseFloat(results[0].lon);

        setSelectedLocation({ lat, lng });
        setStoreName(results[0].display_name.split(",")[0]);

        if (leafletMapRef.current) {
          const L = (window as any).L;
          leafletMapRef.current.setView([lat, lng], 15);

          if (markerRef.current) {
            leafletMapRef.current.removeLayer(markerRef.current);
          }

          markerRef.current = L.marker([lat, lng])
            .addTo(leafletMapRef.current)
            .bindPopup("Click 'Add Location' to save")
            .openPopup();
        }
      } else {
        alert("Location not found. Try clicking on the map.");
      }
    } catch (error) {
      alert("Search failed. Please try again.");
    }
  };

  const addLocation = () => {
    if (!storeName || !selectedLocation) {
      alert("Please enter a store name and select a location");
      return;
    }

    const L = (window as any).L;
    const newMarker = L.marker([selectedLocation.lat, selectedLocation.lng])
      .addTo(leafletMapRef.current)
      .bindPopup(`<strong>${storeName}</strong>`);

    const newLocation: PendingLocation = {
      id: `${Date.now()}-${Math.random()}`,
      name: storeName,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      marker: newMarker,
    };

    setPendingLocations((prev) => [...prev, newLocation]);

    // Clear temp marker
    if (markerRef.current) {
      leafletMapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    // Reset form
    setStoreName("");
    setSelectedLocation(null);
    setSearchQuery("");
  };

  const removeLocation = (id: string) => {
    setPendingLocations((prev) => {
      const location = prev.find((loc) => loc.id === id);
      if (location?.marker && leafletMapRef.current) {
        leafletMapRef.current.removeLayer(location.marker);
      }
      return prev.filter((loc) => loc.id !== id);
    });
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setStoreName("");
    setSearchQuery("");
    if (markerRef.current && leafletMapRef.current) {
      leafletMapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Location
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., '31 The Rocks, Sydney NSW'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearchClick()}
          />
          <Button
            type="button"
            onClick={handleSearchClick}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Or click directly on the map below
        </p>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="h-80 rounded-lg border border-gray-300"
      ></div>

      {/* Store Name Input */}
      {selectedLocation && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter store name"
          />
        </div>
      )}

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">
              Selected Location
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
              {selectedLocation.lng.toFixed(6)}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Add Location Button */}
      {selectedLocation && (
        <Button
          type="button"
          onClick={addLocation}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Add Location to List
        </Button>
      )}

      {/* Pending Locations List */}
      {pendingLocations.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white ">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-800">
              Store Locations Added
            </h3>
            <span className="text-xs font-medium text-green-600">
              {pendingLocations.length}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {pendingLocations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between px-4 py-2 "
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {loc.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLocation(loc.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
