import { useEffect, useState, useRef } from "react";
import axios from "axios";
import type { MicroSite, Store } from "@/types/Microsite";

// Extended store type for display
interface StoreWithMicrosite extends Store {
  micrositeName: string;
}

// Tell TypeScript about Leaflet
declare global {
  interface Window {
    L: any;
  }
}

interface StoreLocationProps {
  micrositeId?: string | number;
}

export default function StoreLocation({ micrositeId }: StoreLocationProps) {
  const [microsites, setMicrosites] = useState<MicroSite[]>([]);
  const [filteredStores, setFilteredStores] = useState<StoreWithMicrosite[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const fetchMicrosites = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/microsites`,
      );
      setMicrosites(res.data.microsites);
    } catch (err) {
      console.error("Error fetching microsites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/microsites`,
      );
      setMicrosites(res.data.microsites);
    } catch (err) {
      console.error("Error refreshing microsites:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMicrosites();
  }, []);

  // Filter stores when microsites or micrositeId changes
  useEffect(() => {
    if (microsites.length === 0) return;

    let stores: StoreWithMicrosite[] = [];

    if (micrositeId) {
      // Filter by specific micrositeId
      const microsite = microsites.find((ms) => ms.id === micrositeId);
      if (microsite) {
        stores = (microsite.stores || []).map((store) => ({
          ...store,
          micrositeName: microsite.name,
        }));
      }
    } else {
      // Show all stores from all microsites (original behavior)
      stores = microsites.flatMap((microsite) =>
        (microsite.stores || []).map((store) => ({
          ...store,
          micrositeName: microsite.name,
        })),
      );
    }

    setFilteredStores(stores);
  }, [microsites, micrositeId]);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = initializeMap;
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && filteredStores.length > 0) {
      renderStores();
    }
  }, [filteredStores]);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Philippines
    const map = window.L.map(mapRef.current).setView([12.8797, 121.774], 6);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapInstanceRef.current = map;
  };

  const renderStores = () => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (filteredStores.length === 0) {
      // If no stores, show default view
      mapInstanceRef.current.setView([12.8797, 121.774], 6);
      return;
    }

    // Add markers for each store with popup
    filteredStores.forEach((store) => {
      if (store.latitude && store.longitude) {
        const marker = window.L.marker([store.latitude, store.longitude]).addTo(
          mapInstanceRef.current,
        ).bindPopup(`
            <div style="text-align: center; min-width: 180px; padding: 8px;">
              <strong style="font-size: 12px; color: #1f2937; display: block; margin-bottom: 4px;">${store.name}</strong>
              <small style="color: #6b7280; font-size: 12px; display: block; margin-bottom: 8px;">${store.micrositeName}</small>
              <button 
                onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}', '_blank')"
                style="
                  background: #22c55e;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: 500;
                  width: 100%;
                  transition: background 0.2s;
                "
                onmouseover="this.style.background='#16a34a'"
                onmouseout="this.style.background='#22c55e'"
              >
                 Get Directions 
              </button>
            </div>
          `);

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers
    const bounds = window.L.latLngBounds(
      filteredStores
        .filter((s) => s.latitude && s.longitude)
        .map((s) => [s.latitude, s.longitude]),
    );
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <div className="w-full">
      {/* Header with optional microsite name and refresh button */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="ml-auto flex items-center gap-1 text-blue-600 rounded-lg hover:text-blue-500 disabled:cursor-not-allowed transition-colors mr-3"
        >
          <svg
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {/* Map Container - Full view */}
      <div className="w-full h-112.5 bg-gray-200 rounded-3xl overflow-hidden shadow-lg relative">
        <div ref={mapRef} className="w-full h-full"></div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-1000">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
