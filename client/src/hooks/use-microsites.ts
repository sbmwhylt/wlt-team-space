import axios from "axios";
import { useEffect, useState } from "react";

type MicroSite = {
  id: string | number;
  name: string;
  slug: string;
  type?: "consumer" | "business";
  link: string;
  banner?: string;
  logo?: string;
  aboutDesc?: string;
  footerDesc?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  digitalCardOrderLink?: string;
  physicalCardOrderLink?: string;
  communityLink?: string;
  mapLink?: string;
  marketingImgs?: string[];
  marketingVids?: string[];
};

export function useMicroSites() {
  const [microsites, setMicrosites] = useState<MicroSite[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = `${import.meta.env.VITE_API_URL}/microsites`;

  // --- GET all microsites ---
  const get = async () => {
    setLoading(true);
    try {
      const res = await axios.get(baseUrl);
      setMicrosites(res.data.microsites || []);
    } catch (err) {
      console.error("Fetch microsites failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- CREATE ---
  const create = async (microsite: Omit<MicroSite, "id">) => {
    try {
      const res = await axios.post(baseUrl, microsite, {
        headers: { "Content-Type": "application/json" },
      });
      setMicrosites((prev) => [...prev, res.data.microsite]);
    } catch (err) {
      console.error("Create microsite failed:", err);
    }
  };

  // --- UPDATE ---
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

  // --- DELETE ---
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

  return { microsites, loading, create, update, remove };
}
