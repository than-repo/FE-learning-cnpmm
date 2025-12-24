// components/AuthProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { User, decodeToken } from "@/lib/jwt";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("accessToken");
      }
      return null;
    }
  );

  const user = accessToken ? decodeToken(accessToken) : null;

  const login = (token: string) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
