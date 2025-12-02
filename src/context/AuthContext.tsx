"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, Role } from "@/types/auth";
import API from "@/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
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
  refreshToken: () => Promise<string | null>;
  isAuthenticated: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const clearAllAuthData = useCallback(() => {
    console.log("AuthContext - Clearing all auth data");

    const authKeys = [
      "token",
      "auth_token",
      "access_token",
      "jwt_token",
      "authToken",
      "refreshToken",
      "user",
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
    ];

    authKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    sessionStorage.clear();

    setUser(null);
    setToken(null);
    delete API.defaults.headers.common["Authorization"];
  }, []);

  const initAuth = useCallback(async () => {
    try {
      console.log("AuthContext - Initializing auth...");

      const possibleTokenKeys = [
        "token",
        "auth_token",
        "access_token",
        "jwt_token",
        "authToken",
        "next-auth.session-token",
        "__Secure-next-auth.session-token",
      ];

      let storedToken = null;
      let foundKey = null;

      for (const key of possibleTokenKeys) {
        const value = localStorage.getItem(key);
        if (
          value &&
          value !== "null" &&
          value !== "undefined" &&
          value.length > 20
        ) {
          storedToken = value;
          foundKey = key;
          console.log(`Found token in key: "${key}", length: ${value.length}`);
          break;
        }
      }

      const storedUser = localStorage.getItem("user");

      console.log("AuthContext - Storage check:", {
        storedToken: storedToken
          ? `${storedToken.substring(0, 20)}...`
          : "No token",
        storedUser: storedUser ? "Exists" : "No user",
        foundKey,
        sessionStatus: status,
        hasSession: !!session,
      });

      // FIRST: Check if we have both token and user in localStorage
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          if (parsedUser && parsedUser.role && storedToken.length > 20) {
            API.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${storedToken}`;

            setUser(parsedUser);
            setToken(storedToken);
            setInitialized(true);
            setLoading(false);
            console.log("AuthContext - Set from localStorage");
            return;
          } else {
            console.warn("AuthContext - Invalid user or token format");
            clearAllAuthData();
          }
        } catch (error) {
          console.error("AuthContext - Error parsing stored user:", error);
          clearAllAuthData();
        }
      }

      // SECOND: If we have user but no token, clear everything
      if (storedUser && !storedToken) {
        console.warn(
          "AuthContext - Found user but no token, clearing invalid data"
        );
        clearAllAuthData();
      }

      // THIRD: Check NextAuth session
      if (status === "authenticated" && session?.user) {
        console.log("AuthContext - NextAuth session is authenticated");

        const sessionUser = session.user as any;
        const userRole = sessionUser.role || "user";

        // Get token from multiple possible locations in the session
        const accessToken =
          sessionUser.token || // From user.token
          (session as any).accessToken || // From session.accessToken
          (session as any).backendToken || // From session.backendToken
          storedToken; // Fallback to stored token

        const userData = {
          id: sessionUser.id || "",
          name: sessionUser.name || "",
          email: sessionUser.email || "",
          role: userRole as Role,
          location: sessionUser.location || "",
        };

        console.log("AuthContext - Session data:", {
          hasAccessToken: !!accessToken,
          accessTokenLength: accessToken?.length || 0,
          sessionKeys: Object.keys(session),
          userToken: sessionUser.token,
          sessionAccessToken: (session as any).accessToken,
          sessionBackendToken: (session as any).backendToken,
        });

        // Check if we have a valid access token from session
        if (accessToken && accessToken.length > 20) {
          console.log("AuthContext - Found valid access token in session");
          API.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          // Save to localStorage
          localStorage.setItem("token", accessToken);
          localStorage.setItem("user", JSON.stringify(userData));

          setToken(accessToken);
          setUser(userData);

          setInitialized(true);
          setLoading(false);
          return;
        } else {
          console.warn(
            "AuthContext - Session exists but no valid access token"
          );

          // Even without token, we might want to keep session info
          // but API calls won't work without token
          setUser(userData);
          setToken(null);
          setInitialized(true);
          setLoading(false);
          return;
        }
      }

      // FOURTH: If nothing works, clear everything
      console.log("AuthContext - No valid auth data found, clearing");

      clearAllAuthData();

      setUser(null);
      setToken(null);
      setInitialized(true);
      setLoading(false);
    } catch (error) {
      console.error("AuthContext - Initialization error:", error);

      clearAllAuthData();

      setUser(null);
      setToken(null);
      setInitialized(true);
      setLoading(false);
    }
  }, [session, status, clearAllAuthData]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log(
        "AuthContext - Session became unauthenticated, clearing auth"
      );
      clearAllAuthData();
    }
  }, [status, clearAllAuthData]);

  const refreshToken = async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await API.post("/auth/refresh-token", { refreshToken });

      const data = response.data;

      if (data.success && data.data.token) {
        const newToken = data.data.token;
        const newRefreshToken = data.data.refreshToken;

        localStorage.setItem("token", newToken);

        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        setToken(newToken);
        API.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        return newToken;
      }

      throw new Error(data.message || "Token refresh failed");
    } catch (error) {
      console.error("Token refresh error:", error);
      clearAllAuthData();
      return null;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      console.log("AuthContext - Attempting login for:", email);

      clearAllAuthData();

      delete API.defaults.headers.common["Authorization"];

      const res = await API.post("/auth/login", { email, password });
      const {
        token: authToken,
        refreshToken,
        user,
      } = res.data.data || res.data;

      if (!user || !authToken) {
        throw new Error("Invalid response from server");
      }

      console.log("AuthContext - Login successful, saving data...");

      if (authToken.length < 20) {
        console.error("AuthContext - Token seems too short, might be invalid");
        throw new Error("Invalid token received from server");
      }

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(user));

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      setUser(user);
      setToken(authToken);

      console.log("AuthContext - Login successful for:", user.email);

      return { success: true, user, token: authToken, refreshToken };
    } catch (error: any) {
      console.error("Login error:", error);
      clearAllAuthData();
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
      clearAllAuthData();

      const res = await API.post("/auth/register", userData);
      const {
        token: authToken,
        refreshToken,
        user,
      } = res.data.data || res.data;

      if (!user || !authToken) {
        throw new Error("Invalid response from server");
      }

      if (authToken.length < 20) {
        console.error("AuthContext - Registration token too short");
        throw new Error("Invalid token received");
      }

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(user));

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      setUser(user);
      setToken(authToken);

      return { success: true, user, token: authToken, refreshToken };
    } catch (error: any) {
      console.error("Registration error:", error);
      clearAllAuthData();
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
      clearAllAuthData();

      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });
      return { success: true };
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      clearAllAuthData();
      return {
        success: false,
        message: "Google sign-in failed. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      console.log("AuthContext - Logging out...");

      // Clear local auth data first
      clearAllAuthData();

      // Sign out from NextAuth
      await signOut({
        callbackUrl: "/auth/login",
        redirect: true,
      });

      console.log("AuthContext - Logout successful");
    } catch (error) {
      console.error("Error during sign out:", error);
      // Fallback: clear everything and redirect
      clearAllAuthData();
      window.location.href = "/auth/login";
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user && token) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        loginWithGoogle,
        logout,
        loading,
        updateUser,
        refreshToken,
        isAuthenticated,
        initialized,
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
