import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, X, Plus, Trash2, Store } from "lucide-react";
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
  micrositeId: string;
  initialLocations?: {
    id?: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
  }[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

type Tab = "current" | "add";

export default function UpdateStoreLocator({
  micrositeId,
  initialLocations = [],
  onSuccess,
  onCancel,
}: UpdateStoreLocatorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("current");
  const [searchQuery, setSearchQuery] = useState("");
  const [storeName, setStoreName] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [existingStores, setExistingStores] = useState<StoreLocation[]>([]);
  const [pendingStores, setPendingStores] = useState<StoreLocation[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const storeNameInputRef = useRef<HTMLInputElement>(null);
  const mapInitializedRef = useRef(false);

  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        );
        const results = await response.json();
        setSearchResults(results);
      } catch {
        // silently fail — user can retry
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [],
  );

  // Init map once when "add" tab is shown
  useEffect(() => {
    if (activeTab !== "add" || mapInitializedRef.current) return;
    if (!mapRef.current) return;

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

      map.on("click", (e: any) => handleMapClick(e.latlng.lat, e.latlng.lng));
      leafletMapRef.current = map;
      mapInitializedRef.current = true;

      // If we have existing stores, fit the map to them
      const all = [...existingStores, ...pendingStores];
      if (all.length > 0) {
        const bounds = L.latLngBounds(all.map((loc) => [loc.lat, loc.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    };
    document.body.appendChild(script);
  }, [activeTab]);

  // Load initial locations into existingStores state (no map markers yet — map may not exist)
  useEffect(() => {
    if (initialLocations.length === 0) return;
    setExistingStores(
      initialLocations.map((loc) => ({
        id: loc.id || `existing-${Date.now()}-${Math.random()}`,
        name: loc.name,
        lat: loc.latitude,
        lng: loc.longitude,
        address: loc.address,
        marker: null,
      })),
    );
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setSearchResults([]);

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((res) => res.json())
      .then((data) => {
        const address = data.display_name || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        setSelectedLocation((prev) => (prev ? { ...prev, address } : { lat, lng, address }));
        setStoreName(
          data.address?.shop || data.address?.building || data.address?.road || address.split(",")[0],
        );
        setTimeout(() => storeNameInputRef.current?.focus(), 100);
      });

    if (leafletMapRef.current) {
      const L = (window as any).L;
      if (markerRef.current) leafletMapRef.current.removeLayer(markerRef.current);
      markerRef.current = L.marker([lat, lng])
        .addTo(leafletMapRef.current)
        .bindPopup("Set a name and click 'Add Store'")
        .openPopup();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setSelectedLocation({ lat, lng, address: result.display_name });
    setStoreName(result.display_name.split(",")[0].trim());
    setSearchQuery(result.display_name.split(",")[0].trim());
    setSearchResults([]);

    if (leafletMapRef.current) {
      const L = (window as any).L;
      leafletMapRef.current.setView([lat, lng], 15);
      if (markerRef.current) leafletMapRef.current.removeLayer(markerRef.current);
      markerRef.current = L.marker([lat, lng])
        .addTo(leafletMapRef.current)
        .bindPopup("Set a name and click 'Add Store'")
        .openPopup();
    }

    setTimeout(() => storeNameInputRef.current?.focus(), 100);
  };

  const addPendingStore = () => {
    if (!storeName.trim() || !selectedLocation) {
      toast.error("Enter a store name and select a location");
      return;
    }

    let marker: any = null;
    if (leafletMapRef.current) {
      const L = (window as any).L;
      marker = L.marker([selectedLocation.lat, selectedLocation.lng])
        .addTo(leafletMapRef.current)
        .bindPopup(`<strong>${storeName}</strong>`);
    }

    if (markerRef.current && leafletMapRef.current) {
      leafletMapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    setPendingStores((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}-${Math.random()}`,
        name: storeName.trim(),
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: selectedLocation.address,
        marker,
      },
    ]);

    setStoreName("");
    setSelectedLocation(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const removePendingStore = (id: string) => {
    setPendingStores((prev) => {
      const loc = prev.find((s) => s.id === id);
      if (loc?.marker && leafletMapRef.current) leafletMapRef.current.removeLayer(loc.marker);
      return prev.filter((s) => s.id !== id);
    });
  };

  const deleteExistingStore = async (id: string) => {
    setIsDeletingId(id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stores/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();

      setExistingStores((prev) => prev.filter((s) => s.id !== id));
      setConfirmDeleteId(null);
      toast.success("Store removed");
    } catch {
      toast.error("Failed to remove store. Please try again.");
    } finally {
      setIsDeletingId(null);
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

  const handleSaveStores = async () => {
    if (pendingStores.length === 0) {
      toast.error("No new stores to save");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/microsites/${micrositeId}/stores`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stores: pendingStores.map((loc) => ({
              name: loc.name,
              latitude: loc.lat,
              longitude: loc.lng,
              address: loc.address,
            })),
          }),
        },
      );

      if (!response.ok) throw new Error();

      toast.success(`${pendingStores.length} store${pendingStores.length > 1 ? "s" : ""} added`);
      onSuccess?.();
    } catch {
      toast.error("Failed to save stores. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabBase =
    "flex-1 py-2 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none";
  const tabActive = "border-gray-900 text-gray-900";
  const tabInactive = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          className={`${tabBase} ${activeTab === "current" ? tabActive : tabInactive}`}
          onClick={() => setActiveTab("current")}
        >
          Current Stores
          {existingStores.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-gray-100 text-gray-600">
              {existingStores.length}
            </span>
          )}
        </button>
        <button
          type="button"
          className={`${tabBase} ${activeTab === "add" ? tabActive : tabInactive}`}
          onClick={() => setActiveTab("add")}
        >
          <span className="inline-flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />
            Add Store
          </span>
          {pendingStores.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-blue-100 text-blue-700">
              {pendingStores.length}
            </span>
          )}
        </button>
      </div>

      {/* Current Stores tab */}
      {activeTab === "current" && (
        <div className="space-y-3">
          {existingStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Store className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">No stores yet</p>
              <button
                type="button"
                className="mt-3 text-sm text-blue-600 hover:underline"
                onClick={() => setActiveTab("add")}
              >
                Add your first store
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {[...existingStores].sort((a, b) => a.name.localeCompare(b.name)).map((loc) => (
                <div key={loc.id} className="px-4 py-3 bg-white">
                  {confirmDeleteId === loc.id ? (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-700">
                        Remove <strong>{loc.name}</strong>?
                      </p>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={isDeletingId === loc.id}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteExistingStore(loc.id)}
                          disabled={isDeletingId === loc.id}
                        >
                          {isDeletingId === loc.id ? (
                            <Spinner className="w-3.5 h-3.5" />
                          ) : (
                            "Remove"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate" title={loc.name}>
                          {loc.name}
                        </div>
                        {loc.address && (
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5" title={loc.address}>
                            {loc.address}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmDeleteId(loc.id)}
                        className="text-gray-300 hover:text-red-500 shrink-0"
                        title="Remove store"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Store tab */}
      {activeTab === "add" && (
        <div className="space-y-4">
          {/* Pending stores — inline summary before map */}
          {pendingStores.length > 0 && (
            <div className="border border-blue-200 rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700">
                Ready to save — {pendingStores.length} new store{pendingStores.length > 1 ? "s" : ""}
              </div>
              <div className="divide-y divide-blue-100">
                {pendingStores.map((loc) => (
                  <div key={loc.id} className="flex items-center gap-2 px-4 py-2.5 bg-white">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="flex-1 text-sm text-gray-800 truncate">{loc.name}</span>
                    <button
                      type="button"
                      onClick={() => removePendingStore(loc.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                      title="Discard"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Search Location
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="e.g., '31 The Rocks, Sydney NSW'"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  performSearch(e.target.value);
                }}
                className="pr-10 text-ellipsis"
                disabled={isSaving}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearching ? (
                  <Spinner className="w-4 h-4 text-gray-400" />
                ) : (
                  <Search className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Or click directly on the map</p>

            {searchResults.length > 0 && (
              <div className="absolute z-1001 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectResult(result)}
                  >
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {result.display_name.split(",")[0]}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {result.display_name.split(",").slice(1).join(",").trim()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div ref={mapRef} className="h-72 rounded-lg border border-gray-300" />

          {/* Selected location form */}
          {selectedLocation && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {selectedLocation.address
                      ? selectedLocation.address.split(",").slice(0, 2).join(",").trim()
                      : `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-gray-400 hover:text-gray-600 shrink-0 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Store Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    ref={storeNameInputRef}
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addPendingStore()}
                    placeholder="Enter store name"
                    disabled={isSaving}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addPendingStore}
                  className="w-full"
                  disabled={!storeName.trim() || isSaving}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Store
                </Button>
              </div>
            </div>
          )}

          {/* Save / Cancel */}
          {pendingStores.length > 0 && (
            <div className="pt-2 border-t border-gray-200 flex gap-3">
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
                  `Save ${pendingStores.length} Store${pendingStores.length > 1 ? "s" : ""}`
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
