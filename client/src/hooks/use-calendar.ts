import axios from "axios";
import { useEffect, useState } from "react";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start: string;
  end: string;
  isAllDay: boolean;
  meetLink: string | null;
}

let cachedEvents: CalendarEvent[] | null = null;
let cachedAt = 0;
const CACHE_TTL = 1000 * 60 * 5;

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(cachedEvents || []);
  const [loading, setLoading] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/calendar`;
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const get = async () => {
    const fresh = Date.now() - cachedAt < CACHE_TTL;
    if (cachedEvents && fresh) {
      setEvents(cachedEvents);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/upcoming`, authHeader());
      cachedEvents = res.data.events || [];
      cachedAt = Date.now();
      setEvents(cachedEvents!);
    } catch (err) {
      console.error("Fetch calendar events failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get();
  }, []);

  return { events, loading, refresh: get };
}
