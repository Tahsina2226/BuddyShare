// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "@/types/auth";
import API from "@/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: Role;
    location: string;
  }) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<AuthResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) {
      setUser({
        name: session.user.name || "",
        email: session.user.email || "",
        role: "user",
      });
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    }
    setLoading(false);
  }, [session, status]);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data.data || res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true, user, token };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: Role;
    location: string;
  }): Promise<AuthResponse> => {
    try {
      const res = await API.post("/auth/register", userData);
      const { token, user } = res.data.data || res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true, user, token };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  const loginWithGoogle = async (): Promise<AuthResponse> => {
    try {
      await signIn("google");
      return { success: true };
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      return {
        success: false,
        message: "Google sign-in failed. Please try again.",
      };
    }
  };

  const logout = () => {
    signOut({ callbackUrl: "/" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, loginWithGoogle, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
