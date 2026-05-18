import axios from "axios";
import { useEffect, useState } from "react";
import type { DashboardPost, DashboardSection } from "@/types/DashboardPost";

const cache: Partial<Record<DashboardSection, DashboardPost[]>> = {};
const cachedAt: Partial<Record<DashboardSection, number>> = {};
const CACHE_TTL = 1000 * 60 * 5;

export function useDashboardPosts(section: DashboardSection) {
  const [posts, setPosts] = useState<DashboardPost[]>(cache[section] || []);
  const [loading, setLoading] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/dashboard-posts`;
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const get = async () => {
    const fresh = Date.now() - (cachedAt[section] ?? 0) < CACHE_TTL;
    if (cache[section] && fresh) {
      setPosts(cache[section]!);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}?section=${section}`, authHeader());
      cache[section] = res.data.posts || [];
      cachedAt[section] = Date.now();
      setPosts(cache[section]!);
    } catch (err) {
      console.error("Fetch dashboard posts failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const create = async (formData: FormData) => {
    try {
      const res = await axios.post(baseUrl, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      cache[section] = [res.data.post, ...(cache[section] || [])];
      setPosts(cache[section]!);
      return res.data.post;
    } catch (err) {
      console.error("Create dashboard post failed:", err);
      throw err;
    }
  };

  const update = async (id: number, formData: FormData) => {
    try {
      const res = await axios.put(`${baseUrl}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      cache[section] = cache[section]?.map((p) => (p.id === id ? res.data.post : p)) || [];
      setPosts(cache[section]!);
      return res.data.post;
    } catch (err) {
      console.error("Update dashboard post failed:", err);
      throw err;
    }
  };

  const remove = async (id: number) => {
    await axios.delete(`${baseUrl}/${id}`, authHeader());
    cache[section] = cache[section]?.filter((p) => p.id !== id) || [];
    setPosts(cache[section]!);
  };

  useEffect(() => {
    get();
  }, [section]);

  return { posts, loading, get, create, update, remove };
}
