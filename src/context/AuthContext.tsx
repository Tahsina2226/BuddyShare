"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/auth";
import { signIn, signOut, useSession } from "next-auth/react";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }

    if (session?.user) {
      setUser({
        name: session.user.name || "",
        email: session.user.email || "",
        role: "user",
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [session, status]);

  const login = async (email: string, password: string) => {
    // Implement your backend login logic here
    console.log("Login attempt:", email, password);
  };

  const register = async (userData: any) => {
    // Implement your backend register logic here
    console.log("Register attempt:", userData);
  };

  const signInWithGoogle = async () => {
    try {
      await signIn("google"); // redirect to Google OAuth
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const logout = () => {
    signOut({ callbackUrl: "/" }); // NextAuth sign out
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, signInWithGoogle, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
