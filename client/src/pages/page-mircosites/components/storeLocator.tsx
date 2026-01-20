import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { debounce } from "lodash";

interface PendingLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  marker?: any;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

interface StoreLocationPickerProps {
  onLocationsChange?: (
    locations: {
      name: string;
      latitude: number;
      longitude: number;
    }[],
  ) => void;
}

export default function StoreLocationPicker({
  onLocationsChange,
}: StoreLocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [storeName, setStoreName] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [pendingLocations, setPendingLocations] = useState<PendingLocation[]>(
    [],
  );

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query,
          )}&limit=5&addressdetails=1`,
        );
        const results = await response.json();
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [],
  );

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
        handleMapClick(e.latlng.lat, e.latlng.lng);
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

  // Handle map click
  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setSearchResults([]);

    // Reverse geocode to get address
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const address =
          data.display_name ||
          `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        setSelectedLocation((prev) => {
          if (!prev) return { lat, lng, address };
          return { ...prev, address };
        });
        setStoreName(
          data.address?.shop ||
            data.address?.building ||
            data.address?.road ||
            address.split(",")[0],
        );
      });

    if (leafletMapRef.current) {
      const L = (window as any).L;
      if (markerRef.current) {
        leafletMapRef.current.removeLayer(markerRef.current);
      }

      markerRef.current = L.marker([lat, lng])
        .addTo(leafletMapRef.current)
        .bindPopup("Click 'Add Location' to save")
        .openPopup();
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    performSearch(value);
  };

  // Handle search result selection
  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setSelectedLocation({
      lat,
      lng,
      address: result.display_name,
    });

    // Set store name to first part of address or building name
    const nameParts = result.display_name.split(",");
    setStoreName(nameParts[0].trim());
    setSearchQuery(result.display_name);
    setSearchResults([]);

    // Focus on store name input
    setTimeout(() => {
      const storeNameInput = document.querySelector(
        'input[placeholder="Enter store name"]',
      ) as HTMLInputElement;
      storeNameInput?.focus();
    }, 100);

    // Update map
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
  };

  // Add location to list
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
      address: selectedLocation.address,
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
    setSearchResults([]);
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
    setSearchResults([]);
    if (markerRef.current && leafletMapRef.current) {
      leafletMapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Box with Dropdown */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Location
        </label>
        <div className="relative">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="e.g., '31 The Rocks, Sydney NSW'"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pr-10"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            ) : (
              <Search className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 group"
                onClick={() => handleSelectResult(result)}
              >
                <div className="flex flex-col gap-1">
                  {/* First line of address - always show */}
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {result.display_name.split(",")[0]}
                  </div>

                  {/* Rest of address - ellipsis if too long */}
                  <div className="text-xs text-gray-500">
                    <div className="line-clamp-2 break-words">
                      {result.display_name.split(",").slice(1).join(",").trim()}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-blue-600 truncate pr-2">
                      {result.type.charAt(0).toUpperCase() +
                        result.type.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {parseFloat(result.lat).toFixed(4)},{" "}
                      {parseFloat(result.lon).toFixed(4)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-1">
          Or click directly on the map below
        </p>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="h-80 rounded-lg border border-gray-300 z-0"
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
            className="font-medium"
          />
          {selectedLocation.address && (
            <div className="mt-1">
              <div
                className="text-xs text-gray-500 truncate"
                title={selectedLocation.address}
              >
                {selectedLocation.address}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Selected Location</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Coordinates: {selectedLocation.lat.toFixed(6)},{" "}
              {selectedLocation.lng.toFixed(6)}
            </div>
            {selectedLocation.address && (
              <div className="mt-2">
                <div
                  className="text-xs text-gray-600 line-clamp-2 break-words"
                  title={selectedLocation.address}
                >
                  {selectedLocation.address}
                </div>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
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
          disabled={!storeName.trim()}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Add Location to List
        </Button>
      )}

      {pendingLocations.map((loc) => (
        <div
          key={loc.id}
          className="flex items-start px-4 py-3 hover:bg-gray-50"
        >
          {/* CONTENT */}
          <div className="flex flex-1 min-w-0 gap-2">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />

            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-medium text-gray-900 truncate"
                title={loc.name}
              >
                {loc.name}
              </div>

              {loc.address && (
                <div
                  className="text-xs text-gray-500 line-clamp-1 break-words mt-1"
                  title={loc.address}
                >
                  {loc.address}
                </div>
              )}

              <div className="text-xs text-gray-400 mt-1">
                {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
              </div>
            </div>
          </div>

          {/* ACTION */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeLocation(loc.id)}
            className="text-gray-400 hover:text-red-600 flex-shrink-0 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
