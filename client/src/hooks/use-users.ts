import { useEffect, useState } from "react";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users`)
      .then(res => res.json())
      .then(data => {
        // console.log("API response:", data);
        setUsers(data.users || []); // unwrap array here
      })
      .catch(err => console.error("Failed to fetch users:", err))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
}
