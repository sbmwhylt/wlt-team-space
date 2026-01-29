import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { debounce } from "lodash";
import toast from "react-hot-toast";

interface StoreLocation {
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

interface UpdateStoreLocatorProps {
  micrositeId: string; // Added: Need this to save to the right microsite
  initialLocations?: {
    id?: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
  }[];
  onSuccess?: () => void; // Added: Callback after successful save
  onCancel?: () => void; // Added: Callback for cancel action
}

export default function UpdateStoreLocator({
  micrositeId,
  initialLocations = [],
  onSuccess,
  onCancel,
}: UpdateStoreLocatorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [storeName, setStoreName] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

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
      const map = L.map(mapRef.current).setView([0, 0], 2);

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

  // Load initial locations onto the map
  useEffect(() => {
    if (!leafletMapRef.current || initialLocations.length === 0) return;

    const L = (window as any).L;
    const loadedLocations: StoreLocation[] = [];

    initialLocations.forEach((loc) => {
      const marker = L.marker([loc.latitude, loc.longitude])
        .addTo(leafletMapRef.current)
        .bindPopup(`<strong>${loc.name}</strong>`);

      loadedLocations.push({
        id: loc.id || `${Date.now()}-${Math.random()}`,
        name: loc.name,
        lat: loc.latitude,
        lng: loc.longitude,
        address: loc.address,
        marker: marker,
      });
    });

    setStoreLocations(loadedLocations);

    if (loadedLocations.length > 0) {
      const bounds = L.latLngBounds(
        loadedLocations.map((loc) => [loc.lat, loc.lng]),
      );
      leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [leafletMapRef.current, initialLocations]);

  // Fit map to show all stores whenever storeLocations changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fitMapToStores();
  }, [storeLocations]);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setSearchResults([]);

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

  const fitMapToStores = () => {
    if (!leafletMapRef.current || storeLocations.length === 0) return;

    const L = (window as any).L;

    const bounds = L.latLngBounds(
      storeLocations.map((loc) => [loc.lat, loc.lng]),
    );

    leafletMapRef.current.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 16,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    performSearch(value);
  };

  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setSelectedLocation({
      lat,
      lng,
      address: result.display_name,
    });

    const nameParts = result.display_name.split(",");
    setStoreName(nameParts[0].trim());
    setSearchQuery(result.display_name);
    setSearchResults([]);

    setTimeout(() => {
      const storeNameInput = document.querySelector(
        'input[placeholder="Enter store name"]',
      ) as HTMLInputElement;
      storeNameInput?.focus();
    }, 100);

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

  const addLocation = () => {
    if (!storeName || !selectedLocation) {
      toast.error("Please enter a store name and select a location");
      return;
    }

    const L = (window as any).L;
    const newMarker = L.marker([selectedLocation.lat, selectedLocation.lng])
      .addTo(leafletMapRef.current)
      .bindPopup(`<strong>${storeName}</strong>`);

    const newLocation: StoreLocation = {
      id: `new-${Date.now()}-${Math.random()}`,
      name: storeName,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      address: selectedLocation.address,
      marker: newMarker,
    };

    setStoreLocations((prev) => [...prev, newLocation]);

    if (markerRef.current) {
      leafletMapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    setStoreName("");
    setSelectedLocation(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeLocation = async (id: string) => {
    // If it's a new store (not saved yet), just remove it from the list
    if (String(id).startsWith("new-")) {
      setStoreLocations((prev) => {
        const location = prev.find((loc) => loc.id === id);
        if (location?.marker && leafletMapRef.current) {
          leafletMapRef.current.removeLayer(location.marker);
        }
        return prev.filter((loc) => loc.id !== id);
      });

      return;
    }

    // If it's an existing store, delete it from the server
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stores/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete store");
      }

      // Remove from map and list
      setStoreLocations((prev) => {
        const location = prev.find((loc) => loc.id === id);
        if (location?.marker && leafletMapRef.current) {
          leafletMapRef.current.removeLayer(location.marker);
        }
        return prev.filter((loc) => loc.id !== id);
      });

      toast.success("Store deleted successfully");
    } catch (error) {
      toast.error("Failed to delete store. Please try again.");
    }
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

  // Handle save all stores
  const handleSaveStores = async () => {
    if (storeLocations.length === 0) {
      toast.error("Please add at least one store");
      return;
    }

    const newStores = storeLocations
      .filter((loc) => String(loc.id).startsWith("new-"))
      .map((loc) => ({
        name: loc.name,
        latitude: loc.lat,
        longitude: loc.lng,
        address: loc.address,
      }));

    if (newStores.length === 0) {
      toast.error("No new stores to save");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/microsites/${micrositeId}/stores`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stores: newStores }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save stores");
      }

      toast.success(`${newStores.length} new stores added successfully!`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving stores:", error);
      toast.error("Failed to save stores. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="space-y-4">
      {storeLocations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm font-medium text-blue-900">
            Current Stores: {storeLocations.length}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Click on a store below to remove it, or add new stores using the
            search and map
          </div>
        </div>
      )}

      {storeLocations.length > 0 && (
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          {storeLocations.map((loc) => (
            <div
              key={loc.id}
              className="flex items-start px-4 py-3 hover:bg-gray-50"
            >
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

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLocation(loc.id)}
                className="text-gray-400 hover:text-red-600 flex-shrink-0 ml-2"
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {storeLocations.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Add New Locations
            </span>
          </div>
        </div>
      )}

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
            disabled={isSaving}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <Spinner className="w-4 h-4 text-gray-400" />
            ) : (
              <Search className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

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
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {result.display_name.split(",")[0]}
                  </div>

                  <div className="text-xs text-gray-500">
                    <div className="line-clamp-2 break-words">
                      {result.display_name.split(",").slice(1).join(",").trim()}
                    </div>
                  </div>

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

      <div
        ref={mapRef}
        className="h-80 rounded-lg border border-gray-300 z-0"
      ></div>

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
            disabled={isSaving}
          />
        </div>
      )}

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
                  className="text-xs text-gray-600 w-full"
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
            disabled={isSaving}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {selectedLocation && (
        <Button
          type="button"
          onClick={addLocation}
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={!storeName.trim() || isSaving}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Add Location to List
        </Button>
      )}

      {/* SAVE AND CANCEL BUTTONS */}
      {storeLocations.length > 0 && (
        <div className="pt-4 border-t border-gray-200 flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="flex-1"
            >
              Cancel
            </Button>
          )}

          <Button
            type="button"
            onClick={handleSaveStores}
            disabled={isSaving}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Saving...
              </>
            ) : (
              <>Save All Stores ({storeLocations.length})</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
