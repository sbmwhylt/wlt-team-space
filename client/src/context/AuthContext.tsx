import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import type { User } from "@/types/User";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const AUTO_LOGOUT_TIME = 3 * 24 * 60 * 60 * 1000; // 3 days

  // --- Refresh user from backend ---
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!currentToken || !storedUser) return;

    try {
      const userData = JSON.parse(storedUser);
      if (!userData?.id) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userData.id}`,
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );

      const updatedUser: User = res.data.user;

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to refresh user:", err);
      // remove invalid data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    }
  }, []);

  // --- Auto logout timer ---
  useEffect(() => {
    if (!token) return;

    const loginTime = Number(localStorage.getItem("loginTime"));
    if (!loginTime) return;

    const elapsed = Date.now() - loginTime;
    if (elapsed > AUTO_LOGOUT_TIME) {
      logout();
    } else {
      const remaining = AUTO_LOGOUT_TIME - elapsed;
      const timer = setTimeout(() => {
        logout();
        toast.error("Session expired. Please log in again.");
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [token]);

  // --- Load user from localStorage on mount ---
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      refreshUser(); // fetch from backend if missing
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);

      // If avatar is missing, fetch latest user
      if (!parsedUser.avatar) refreshUser();
    } catch {
      console.error("Failed to parse user from localStorage");
      refreshUser();
    }
  }, [token, refreshUser]);

  // --- Login ---
  const login = (userData: User, tokenData: string) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loginTime", Date.now().toString());

    setUser(userData);
    setToken(tokenData);
  };

  // --- Logout ---
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
