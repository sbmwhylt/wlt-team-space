import axios from "axios";
import { useEffect, useState } from "react";
import type { User } from "@/types/User";

let cachedUsers: User[] | null = null;
let cachedAt = 0;
const CACHE_TTL = 1000 * 60 * 5;

export function useUsers() {
  const [users, setUsers] = useState<User[]>(cachedUsers || []);
  const [loading, setLoading] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

  // --------------- GET all users
  const get = async () => {
    const fresh = Date.now() - cachedAt < CACHE_TTL;
    if (cachedUsers && fresh) {
      setUsers(cachedUsers || []);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(baseUrl);
      cachedUsers = res.data.users || [];
      cachedAt = Date.now();
      setUsers(cachedUsers || []);
    } catch (err) {
      console.error("Fetch users failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // --------------- CREATE
  const create = async (user: Omit<User, "id">) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        user
      );
      cachedUsers = [...(cachedUsers || []), res.data.user];
      setUsers(cachedUsers || []);
      return res.data.user;
    } catch (err) {
      console.error("Create user failed:", err);
    }
  };

  // --------------- UPDATE
  const update = async (id: string | number, data: Partial<User>) => {
    const res = await axios.put(`${baseUrl}/${id}`, data);
    cachedUsers =
      cachedUsers?.map((u) => (u.id === id ? res.data.user : u)) || [];
    setUsers(cachedUsers || []);
    return res.data.user;
  };

  // --------------- DELETE
  const remove = async (id: string | number) => {
    await axios.delete(`${baseUrl}/${id}`);
    cachedUsers = cachedUsers?.filter((u) => u.id !== id) || [];
    setUsers(cachedUsers || []);
  };

  useEffect(() => {
    get();
  }, []);

  return {
    users,
    loading,
    get,
    create,
    update,
    remove,
  };
}
