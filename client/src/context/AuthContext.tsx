import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

interface User {
  id?: string;
  email?: string;
  role?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
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
  // const AUTO_LOGOUT_TIME = 5 * 1000; // 5 seconds testing

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (token && loginTime) {
      const elapsed = Date.now() - Number(loginTime);
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
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          console.error("Failed to parse user from localStorage");
        }
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (userData: User, tokenData: string) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loginTime", Date.now().toString());
    setUser(userData);
    setToken(tokenData);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
