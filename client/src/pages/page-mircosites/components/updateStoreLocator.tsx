import { useState, useEffect, useRef, useMemo } from "react";
import { Search, MapPin, X, Plus, Trash2, Store, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import toast from "react-hot-toast";

// ─── Minimal Leaflet surface ─────────────────────────────────────────────────
// Leaflet is loaded from a CDN at runtime, so we describe just what we call.
interface LeafletMarker {
  addTo: (map: LeafletMap) => LeafletMarker;
  bindPopup: (html: string) => LeafletMarker;
  openPopup: () => LeafletMarker;
}

interface LeafletMap {
  setView: (center: [number, number], zoom: number) => LeafletMap;
  fitBounds: (bounds: unknown, options?: { padding: [number, number] }) => void;
  on: (
    event: "click",
    handler: (e: { latlng: { lat: number; lng: number } }) => void,
  ) => void;
  removeLayer: (layer: LeafletMarker) => void;
  invalidateSize: () => void;
  remove: () => void;
}

interface Leaflet {
  map: (el: HTMLElement) => LeafletMap;
  tileLayer: (
    url: string,
    options: { attribution: string },
  ) => { addTo: (map: LeafletMap) => void };
  marker: (latlng: [number, number]) => LeafletMarker;
  latLngBounds: (coords: [number, number][]) => unknown;
}

const getLeaflet = () => (window as unknown as { L?: Leaflet }).L;

const LEAFLET_VERSION = "1.9.4";

/** Loads the Leaflet script/stylesheet once per page, reusing them afterwards. */
function loadLeaflet(): Promise<Leaflet> {
  return new Promise((resolve) => {
    const existing = getLeaflet();
    if (existing) return resolve(existing);

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
      document.head.appendChild(link);
    }

    let script = document.getElementById(
      "leaflet-js",
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
      document.body.appendChild(script);
    }

    script.addEventListener("load", () => resolve(getLeaflet() as Leaflet), {
      once: true,
    });
  });
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface StoreLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  marker?: LeafletMarker | null;
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
  const [existingStores, setExistingStores] = useState<StoreLocation[]>(() =>
    initialLocations.map((loc) => ({
      id: loc.id || `existing-${Date.now()}-${Math.random()}`,
      name: loc.name,
      lat: loc.latitude,
      lng: loc.longitude,
      address: loc.address,
      marker: null,
    })),
  );
  const [pendingStores, setPendingStores] = useState<StoreLocation[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const storeNameInputRef = useRef<HTMLInputElement>(null);
  const existingMarkersRef = useRef<Record<string, LeafletMarker>>({});
  const didFitBoundsRef = useRef(false);

  const performSearch = useMemo(
    () =>
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

  useEffect(() => () => performSearch.cancel(), [performSearch]);

  // Init the map once. The "add" panel stays mounted and is only hidden, so the
  // map survives tab switches — it just needs invalidateSize() when shown.
  useEffect(() => {
    let cancelled = false;

    loadLeaflet().then((L) => {
      if (cancelled || !mapRef.current || leafletMapRef.current) return;

      const map = L.map(mapRef.current).setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      map.on("click", (e) => handleMapClick(e.latlng.lat, e.latlng.lng));

      leafletMapRef.current = map;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Drop a pin for every saved store
  useEffect(() => {
    const map = leafletMapRef.current;
    const L = getLeaflet();
    if (!mapReady || !map || !L) return;

    existingStores.forEach((store) => {
      if (existingMarkersRef.current[store.id]) return;
      existingMarkersRef.current[store.id] = L.marker([store.lat, store.lng])
        .addTo(map)
        .bindPopup(`<strong>${store.name}</strong>`);
    });
  }, [mapReady, existingStores]);

  // The map is created while hidden, so re-measure it whenever the tab opens
  // and frame the saved stores the first time it becomes visible.
  useEffect(() => {
    const map = leafletMapRef.current;
    const L = getLeaflet();
    if (activeTab !== "add" || !mapReady || !map || !L) return;

    map.invalidateSize();

    if (didFitBoundsRef.current || existingStores.length === 0) return;
    map.fitBounds(
      L.latLngBounds(
        existingStores.map((s) => [s.lat, s.lng] as [number, number]),
      ),
      { padding: [50, 50] },
    );
    didFitBoundsRef.current = true;
  }, [activeTab, mapReady, existingStores]);

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
        setSelectedLocation((prev) =>
          prev ? { ...prev, address } : { lat, lng, address },
        );
        setStoreName(
          data.address?.shop ||
            data.address?.building ||
            data.address?.road ||
            address.split(",")[0],
        );
        setTimeout(() => storeNameInputRef.current?.focus(), 100);
      });

    const map = leafletMapRef.current;
    const L = getLeaflet();
    if (map && L) {
      if (markerRef.current) map.removeLayer(markerRef.current);
      markerRef.current = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("Set a name and click 'Add Store'")
        .openPopup();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const shortName = result.display_name.split(",")[0].trim();

    setSelectedLocation({ lat, lng, address: result.display_name });
    setStoreName(shortName);
    setSearchQuery(shortName);
    setSearchResults([]);

    const map = leafletMapRef.current;
    const L = getLeaflet();
    if (map && L) {
      map.setView([lat, lng], 15);
      if (markerRef.current) map.removeLayer(markerRef.current);
      markerRef.current = L.marker([lat, lng])
        .addTo(map)
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

    const map = leafletMapRef.current;
    const L = getLeaflet();
    let marker: LeafletMarker | null = null;

    if (map && L) {
      marker = L.marker([selectedLocation.lat, selectedLocation.lng])
        .addTo(map)
        .bindPopup(`<strong>${storeName}</strong>`);

      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
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
      if (loc?.marker && leafletMapRef.current) {
        leafletMapRef.current.removeLayer(loc.marker);
      }
      return prev.filter((s) => s.id !== id);
    });
  };

  const deleteExistingStore = async (id: string) => {
    setIsDeletingId(id);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stores/${id}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error();

      // Drop its pin from the map too
      const marker = existingMarkersRef.current[id];
      if (marker && leafletMapRef.current) {
        leafletMapRef.current.removeLayer(marker);
        delete existingMarkersRef.current[id];
      }

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

      toast.success(
        `${pendingStores.length} store${pendingStores.length > 1 ? "s" : ""} added`,
      );
      onSuccess?.();
    } catch {
      toast.error("Failed to save stores. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const sortedExisting = [...existingStores].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className="space-y-4">
      {/* ── Tabs ── */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        <TabButton
          active={activeTab === "current"}
          onClick={() => setActiveTab("current")}
          icon={Store}
          label="Current Stores"
          count={existingStores.length}
        />
        <TabButton
          active={activeTab === "add"}
          onClick={() => setActiveTab("add")}
          icon={Plus}
          label="Add Stores"
          count={pendingStores.length}
          countClass="bg-green-100 text-green-700"
        />
      </div>

      {/* ── Current stores ── */}
      {activeTab === "current" && (
        <>
          {existingStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 text-gray-400">
              <Store className="mb-3 h-9 w-9 opacity-40" />
              <p className="text-sm font-medium">No stores yet</p>
              <p className="mt-0.5 text-xs">
                Saved locations appear on the microsite store locator.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setActiveTab("add")}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add your first store
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-4 py-2.5">
                <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                  {existingStores.length} saved{" "}
                  {existingStores.length === 1 ? "location" : "locations"}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("add")}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-3 w-3" />
                  Add more
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 bg-gray-50/30 p-3 lg:grid-cols-2">
                {sortedExisting.map((loc) => (
                  <div
                    key={loc.id}
                    className={cn(
                      "rounded-lg border bg-white p-3 transition-colors",
                      confirmDeleteId === loc.id
                        ? "border-red-200 bg-red-50/40"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    {confirmDeleteId === loc.id ? (
                      <div className="space-y-2.5">
                        <p className="text-sm text-gray-700">
                          Remove{" "}
                          <span className="font-semibold">{loc.name}</span>?
                          This cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isDeletingId === loc.id}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => deleteExistingStore(loc.id)}
                            disabled={isDeletingId === loc.id}
                          >
                            {isDeletingId === loc.id ? (
                              <Spinner className="h-3.5 w-3.5" />
                            ) : (
                              "Remove"
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div
                            className="truncate text-sm font-medium text-gray-900"
                            title={loc.name}
                          >
                            {loc.name}
                          </div>
                          <div
                            className="mt-0.5 line-clamp-2 text-xs text-gray-500"
                            title={loc.address}
                          >
                            {loc.address ??
                              `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setConfirmDeleteId(loc.id)}
                          className="shrink-0 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                          title="Remove store"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Add stores ──
          Kept mounted so the Leaflet instance and its pins survive tab switches. */}
      <div className={cn("space-y-4", activeTab !== "add" && "hidden")}>
        {/* Staged stores */}
        {pendingStores.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-green-200">
            <div className="flex items-center gap-2 border-b border-green-100 bg-green-50 px-4 py-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                {pendingStores.length}
              </span>
              <span className="text-xs font-semibold text-green-800">
                Ready to save — not yet added to the microsite
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 bg-white p-3 lg:grid-cols-2">
              {pendingStores.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center gap-2.5 rounded-lg border border-green-100 bg-green-50/30 px-3 py-2.5"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-green-500" />
                  <span className="flex-1 truncate text-sm text-gray-800">
                    {loc.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePendingStore(loc.id)}
                    className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Discard"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <label
            htmlFor="store-search"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Search Location
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="store-search"
              type="text"
              placeholder="e.g. 31 The Rocks, Sydney NSW"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                performSearch(e.target.value);
              }}
              className="pr-10 pl-9"
              disabled={isSaving}
            />
            {isSearching && (
              <Spinner className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute z-[1001] mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                  onClick={() => handleSelectResult(result)}
                >
                  <div className="truncate text-sm font-medium text-gray-900">
                    {result.display_name.split(",")[0]}
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                    {result.display_name.split(",").slice(1).join(",").trim()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200">
          <div ref={mapRef} className="h-[28rem] w-full bg-gray-50" />
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-50 text-sm text-gray-400">
              <Spinner className="h-4 w-4" />
              Loading map…
            </div>
          )}
          {mapReady && !selectedLocation && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[400] flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/45 to-transparent px-3 pt-6 pb-2 text-xs font-medium text-white">
              <Info className="h-3.5 w-3.5" />
              Search above or click the map to drop a pin
            </div>
          )}
        </div>

        {/* Selected location */}
        {selectedLocation && (
          <div className="overflow-hidden rounded-xl border border-blue-200">
            <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
                <span className="truncate text-sm text-blue-900">
                  {selectedLocation.address
                    ? selectedLocation.address
                        .split(",")
                        .slice(0, 2)
                        .join(",")
                        .trim()
                    : `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`}
                </span>
              </div>
              <button
                type="button"
                onClick={clearSelection}
                className="ml-2 shrink-0 rounded-full p-1 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <label
                  htmlFor="store-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Store Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="store-name"
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
                <Plus className="mr-2 h-4 w-4" />
                Add Store
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
        <p className="min-w-0 truncate text-xs text-gray-500">
          {pendingStores.length > 0
            ? `${pendingStores.length} store${pendingStores.length > 1 ? "s" : ""} waiting to be saved`
            : "Removals are applied immediately"}
        </p>
        <div className="flex shrink-0 gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              {pendingStores.length > 0 ? "Cancel" : "Close"}
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSaveStores}
            disabled={isSaving || pendingStores.length === 0}
          >
            {isSaving ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Saving…
              </>
            ) : pendingStores.length > 0 ? (
              `Save ${pendingStores.length} Store${pendingStores.length > 1 ? "s" : ""}`
            ) : (
              "Save Stores"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab button ──────────────────────────────────────────────────────────────
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  countClass = "bg-gray-200 text-gray-700",
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Store;
  label: string;
  count: number;
  countClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
      {count > 0 && (
        <span
          className={cn(
            "ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold",
            countClass,
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
