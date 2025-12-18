import axios from "axios";
import { useEffect, useState } from "react";
import type { MicroSite } from "@/types/Microsite";

let cachedMicrosites: MicroSite[] | null = null;
let cachedAt = 0;
const CACHE_TTL = 1000 * 60 * 5;

export function useMicroSites() {
  const [microsites, setMicrosites] = useState<MicroSite[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = `${import.meta.env.VITE_API_URL}/microsites`;

  // --------------- GET all microsites
  const get = async () => {
    const fresh = Date.now() - cachedAt < CACHE_TTL;
    if (cachedMicrosites && fresh) {
      setMicrosites(cachedMicrosites || []);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(baseUrl);
      cachedMicrosites = res.data.microsites || [];
      cachedAt = Date.now();
      setMicrosites(res.data.microsites || []);
    } catch (err) {
      console.error("Fetch microsites failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // --------------- GET microsite by slug
  const getBySlug = async (slug: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/${slug}`);
      return res.data.microsite;
    } catch (err) {
      console.error("Fetch microsite by slug failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // --------------- CREATE
  const create = async (formData: FormData) => {
    setLoading(true);
    try {
      const res = await axios.post(baseUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Invalidate cache and refresh list
      cachedMicrosites = null;
      await get(); // Fetch fresh data
      return res.data.microsite;
    } catch (err) {
      console.error("Create microsite failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --------------- UPDATE
  const update = async (id: string | number, data: Partial<MicroSite>) => {
    try {
      const res = await axios.put(`${baseUrl}/${id}`, data);
      setMicrosites((prev) =>
        prev.map((m) => (m.id === id ? res.data.microsite : m))
      );
    } catch (err) {
      console.error("Update microsite failed:", err);
    }
  };

  // --------------- DELETE
  const remove = async (id: string | number) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      setMicrosites((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete microsite failed:", err);
    }
  };

  useEffect(() => {
    get();
  }, []);

  return { microsites, loading, create, get, update, remove, getBySlug };
}
