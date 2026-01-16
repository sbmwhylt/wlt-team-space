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

export default function StoreLocation() {
  const [microsites, setMicrosites] = useState<MicroSite[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const fetchMicrosites = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/microsites`
        );
        setMicrosites(res.data.microsites);
      } catch (err) {
        console.error("Error fetching microsites:", err);
      }
    };
    fetchMicrosites();
  }, []);

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
    if (mapInstanceRef.current && microsites.length > 0) {
      renderStores();
    }
  }, [microsites]);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Philippines
    const map = window.L.map(mapRef.current).setView([12.8797, 121.774], 6);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapInstanceRef.current = map;

    // Render stores if already loaded
    if (microsites.length > 0) {
      renderStores();
    }
  };

  const renderStores = () => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Get all stores from all microsites
    const allStores: StoreWithMicrosite[] = microsites.flatMap((microsite) =>
      (microsite.stores || []).map((store) => ({
        ...store,
        micrositeName: microsite.name,
      }))
    );

    if (allStores.length === 0) return;

    // Add markers for each store with popup
    allStores.forEach((store) => {
      if (store.latitude && store.longitude) {
        const marker = window.L.marker([store.latitude, store.longitude]).addTo(
          mapInstanceRef.current
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
      allStores
        .filter((s) => s.latitude && s.longitude)
        .map((s) => [s.latitude, s.longitude])
    );
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <div className="w-full">
      {/* Map Container - Full view */}
      <div className="w-full h-[450px] bg-gray-200 rounded-3xl overflow-hidden shadow-lg">
        <div ref={mapRef} className="w-full h-full"></div>
      </div>
    </div>
  );
}
