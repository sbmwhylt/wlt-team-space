import React, { createContext, useState, useEffect, type ReactNode } from "react";

// Define the shape of the user object
interface User {
  id?: string;
  email?: string;
  role?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  // add more fields as needed
}

// Define what the context will contain
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
}

// Create the context with a default (empty) value
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
  // ------------------- STATE
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // ------------------- CHECK TOKEN
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
        }
      }
    } else {
      setUser(null);
    }
  }, [token]);

  // ------------------- LOGIN
  const login = (userData: User, tokenData: string) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(tokenData);
  };

  // ------------------- LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
