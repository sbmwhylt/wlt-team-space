import { useState, useEffect, useRef } from "react";

interface Microsite {
  id: string | number;
  name: string;
  stores?: Store[];
}

interface Store {
  id: string | number;
  name: string;
  latitude?: number;
  longitude?: number;
  micrositeId: string | number;
}

interface SelectedLocation {
  lat: number;
  lng: number;
}

export default function StoreLocator() {
  const [microsites, setMicrosites] = useState<Microsite[]>([]);
  const [selectedMicrosite, setSelectedMicrosite] = useState<string | number>(
    ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [storeName, setStoreName] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [stores, setStores] = useState<Store[]>([]);

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
          .bindPopup("Selected location")
          .openPopup();
      });

      leafletMapRef.current = map;
    };
    document.body.appendChild(script);
  }, []);

  // Fetch microsites on load
  useEffect(() => {
    fetchMicrosites();
  }, []);

  // Fetch stores when microsite changes
  useEffect(() => {
    if (selectedMicrosite) {
      const microsite = microsites.find((m) => m.id === selectedMicrosite);
      setStores(microsite?.stores || []);
    }
  }, [selectedMicrosite, microsites]);

  const fetchMicrosites = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/microsites`
      );
      const data = await response.json();
      setMicrosites(data.microsites || []);
    } catch (error) {
      console.error("Error fetching microsites:", error);
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery) {
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
              .bindPopup("Selected location")
              .openPopup();
          }
        } else {
          alert("Location not found. Try clicking on the map.");
        }
      } catch (error) {
        alert("Search failed. Please click on the map instead.");
      }
    }
  };

  const handleSaveStore = async () => {
    if (!storeName || !selectedLocation || !selectedMicrosite) {
      alert("Please select a microsite, location, and enter a store name");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: storeName,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          micrositeId: selectedMicrosite,
        }),
      });

      if (response.ok) {
        alert("Store saved successfully! ✓");
        setStoreName("");
        setSelectedLocation(null);
        setSearchQuery("");

        // Refresh microsites to get updated stores
        await fetchMicrosites();

        if (markerRef.current && leafletMapRef.current) {
          leafletMapRef.current.removeLayer(markerRef.current);
        }
      } else {
        const error = await response.json();
        alert("Error: " + error.error);
      }
    } catch (error) {
      alert("Failed to save store");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        📍 Store Location Manager
      </h1>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            background: "#e7f3ff",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        >
          <strong>How to add a store:</strong>
          <br />
          1. Select a microsite from the dropdown
          <br />
          2. Search for an address OR click on the map
          <br />
          3. Enter store name and save!
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Select Microsite:
          </label>
          <select
            value={selectedMicrosite}
            onChange={(e) => setSelectedMicrosite(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              border: "2px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <option value="">-- Choose a Microsite --</option>
            {microsites.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search for an address (e.g., 'SM Mall of Asia, Manila') - Press Enter"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            border: "2px solid #ddd",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        />

        <div
          ref={mapRef}
          style={{ height: "400px", borderRadius: "5px", marginBottom: "15px" }}
        ></div>

        {selectedLocation && (
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Store Name:
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter store name"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
        )}

        {selectedLocation && (
          <div
            style={{
              background: "#f0f0f0",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
            }}
          >
            <small>
              Selected: Lat {selectedLocation.lat.toFixed(4)}, Lng{" "}
              {selectedLocation.lng.toFixed(4)}
            </small>
          </div>
        )}

        <button
          onClick={handleSaveStore}
          style={{
            padding: "12px 24px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          💾 Save Store
        </button>

        <div style={{ marginTop: "30px" }}>
          <h3>Stores for Selected Microsite:</h3>
          {stores.length === 0 ? (
            <p style={{ color: "#999" }}>
              No stores saved yet for this microsite.
            </p>
          ) : (
            stores.map((store) => (
              <div
                key={store.id}
                style={{
                  background: "#f9f9f9",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  borderLeft: "4px solid #007bff",
                }}
              >
                <h4 style={{ margin: "0 0 5px 0" }}>{store.name}</h4>
                <small>
                  Lat: {store.latitude}, Lng: {store.longitude}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
