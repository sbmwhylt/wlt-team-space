import axios from "axios";
import { useEffect, useState } from "react";

type User = {
  id: string | number;
  firstName: string;
  lastName: string;
  userName: string;
  gender: "male" | "female";
  birthDate: Date; 
  email: string;
  password: string;
  role: "super-admin" | "admin" | "user"; 
  status: "active" | "inactive"; 
  avatar?: string;
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

  // --- GET all users ---
  const get = async () => {
    setLoading(true);
    try {
      const res = await axios.get(baseUrl);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Fetch users failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- CREATE ---
  const create = async (user: Omit<User, "id">) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        user
      );
      setUsers((prev) => [...prev, res.data.user]);
      return res.data;
    } catch (err: any) {
      console.error("Create user failed:", err);
      console.error("Backend says:", err.response?.data);
      throw err;
    }
  };

  // --- UPDATE ---
  const update = async (id: string | number, data: Partial<User>) => {
    try {
      const res = await axios.put(`${baseUrl}/${id}`, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? res.data.user : u)));
      return res.data;
    } catch (err: any) {
      console.error("Update user failed:", err);
      throw err;
    }
  };

  // --- DELETE ---
  const remove = async (id: string | number) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error("Delete user failed:", err);
      throw err;
    }
  };

  useEffect(() => {
    get();
  }, []);

  return { users, loading, create, get, update, remove };
}
