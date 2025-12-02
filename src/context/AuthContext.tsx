"use client";

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
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (status === "loading") return;

      try {
        // Check localStorage first
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.role) {
              setUser(parsedUser);
              return;
            }
          } catch (error) {
            console.error("Error parsing stored user:", error);
          }
        }

        // Check NextAuth session - এখানে fix করুন
        if (session?.user) {
          console.log("AuthContext - Setting from NextAuth session:", session.user);
          
          // session.user থেকে role নিন, না পাওয়া গেলে default 'user'
          const sessionUser = session.user as any; // Type assertion
          const userRole = sessionUser.role || 'user';
          
          const userData = {
            id: sessionUser.id || "",
            name: sessionUser.name || "",
            email: sessionUser.email || "",
            role: userRole as Role, // <-- এখানে session থেকে role নিন
          };
          
          console.log("AuthContext - Creating user data:", userData);
          
          setUser(userData);
          
          // localStorage-এও save করুন
          localStorage.setItem("user", JSON.stringify(userData));
          return;
        }

        // If nothing works, clear storage
        if (!session?.user && !storedUser) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [session, status]);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data.data || res.data;

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

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

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

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
      await signIn("google", { 
        callbackUrl: "/",
        redirect: true 
      });
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    signOut({ callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        login, 
        register, 
        loginWithGoogle, 
        logout, 
        loading,
        updateUser 
      }}
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