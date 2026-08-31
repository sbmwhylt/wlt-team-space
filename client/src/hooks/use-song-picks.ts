import axios from "axios";
import { useEffect, useState } from "react";
import type { SongPick } from "@/types/SongPick";

export function useSongPicks() {
  const [songs, setSongs] = useState<SongPick[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/song-picks`;
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const get = async () => {
    setLoading(true);
    try {
      const res = await axios.get(baseUrl, authHeader());
      setSongs(res.data.songs || []);
    } catch (err) {
      console.error("Fetch song picks failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: { title: string; artist: string; url: string }) => {
    try {
      const res = await axios.post(baseUrl, payload, authHeader());
      setSongs((prev) => [res.data.song, ...prev]);
      return res.data.song;
    } catch (err) {
      console.error("Create song pick failed:", err);
      throw err;
    }
  };

  const remove = async (id: number) => {
    await axios.delete(`${baseUrl}/${id}`, authHeader());
    setSongs((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    get();
  }, []);

  return { songs, loading, get, create, remove };
}
