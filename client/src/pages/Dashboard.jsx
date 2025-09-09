import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard! You are logged in as: {user?.userName}</p>
      <Button className="mt-4" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
