import axios from "axios";
import { useEffect, useState } from "react";
import type { NoticePost } from "@/types/NoticePost";

let cachedPosts: NoticePost[] | null = null;
let cachedAt = 0;
const CACHE_TTL = 1000 * 60 * 5;

export function useNoticeBoard() {
  const [posts, setPosts] = useState<NoticePost[]>(cachedPosts || []);
  const [loading, setLoading] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/notice-posts`;
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // --------------- GET all posts
  const get = async () => {
    const fresh = Date.now() - cachedAt < CACHE_TTL;
    if (cachedPosts && fresh) {
      setPosts(cachedPosts || []);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(baseUrl, authHeader());
      cachedPosts = res.data.posts || [];
      cachedAt = Date.now();
      setPosts(cachedPosts || []);
    } catch (err) {
      console.error("Fetch notice posts failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // --------------- CREATE
  const create = async (formData: FormData) => {
    try {
      const res = await axios.post(baseUrl, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      cachedPosts = [res.data.post, ...(cachedPosts || [])];
      setPosts(cachedPosts || []);
      return res.data.post;
    } catch (err) {
      console.error("Create notice post failed:", err);
      throw err;
    }
  };

  // --------------- UPDATE
  const update = async (id: number, formData: FormData) => {
    try {
      const res = await axios.put(`${baseUrl}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      cachedPosts =
        cachedPosts?.map((p) => (p.id === id ? res.data.post : p)) || [];
      setPosts(cachedPosts || []);
      return res.data.post;
    } catch (err) {
      console.error("Update notice post failed:", err);
      throw err;
    }
  };

  // --------------- DELETE
  const remove = async (id: number) => {
    await axios.delete(`${baseUrl}/${id}`, authHeader());
    cachedPosts = cachedPosts?.filter((p) => p.id !== id) || [];
    setPosts(cachedPosts || []);
  };

  useEffect(() => {
    get();
  }, []);

  return {
    posts,
    loading,
    get,
    create,
    update,
    remove,
  };
}
