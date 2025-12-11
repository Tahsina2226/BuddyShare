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

  const syncGoogleAuthWithBackend = async (idToken: string, email: string, name: string): Promise<AuthResponse> => {
    try {
      console.log("🔐 Syncing Google auth with backend...");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: idToken,
          email,
          name,
        }),
      });

      const data = await response.json();
      console.log("Backend Google auth response:", data);
      
      if (data.success && data.data?.token) {
        const { token, user } = data.data;
        
        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Set API header
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Update state
        setUser(user);
        setToken(token);
        
        console.log("✅ Google auth synchronized successfully");
        return { success: true, user, token };
      }
      
      return { success: false, message: data.message || "Google auth failed" };
    } catch (error) {
      console.error("Google sync error:", error);
      return { success: false, message: "Failed to sync with backend" };
    }
  };

  const initAuth = useCallback(async () => {
    try {
      console.log("🔄 AuthContext - Initializing auth...");
      
      // First, check localStorage for existing auth
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      console.log("📦 LocalStorage check:", {
        hasToken: !!storedToken,
        hasUser: !!storedUser,
        tokenLength: storedToken?.length || 0
      });

      // Clean up invalid data
      if (storedToken && storedToken.length < 20) {
        console.warn("⚠️ Invalid token length, clearing");
        clearAllAuthData();
      }
      
      if (storedUser && (!storedToken || storedToken.length < 20)) {
        console.warn("⚠️ User exists without valid token, clearing");
        clearAllAuthData();
      }

      // If we have valid localStorage data, use it
      if (storedToken && storedToken.length > 20 && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          if (parsedUser && parsedUser.email) {
            console.log("✅ Setting auth from localStorage");
            API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            setUser(parsedUser);
            setToken(storedToken);
            setInitialized(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("❌ Error parsing stored user:", error);
          clearAllAuthData();
        }
      }

      // Check NextAuth session
      console.log("🔍 Checking NextAuth session:", {
        status,
        hasSession: !!session,
        sessionKeys: session ? Object.keys(session) : []
      });

      if (status === "authenticated" && session?.user) {
        console.log("✅ NextAuth session authenticated");
        
        const sessionUser = session.user as any;
        const accessToken = 
          sessionUser.token || 
          (session as any).accessToken ||
          (session as any).backendToken ||
          localStorage.getItem("token");

        const userData = {
          id: sessionUser.id || "",
          name: sessionUser.name || "",
          email: sessionUser.email || "",
          role: (sessionUser.role || "user") as Role,
          location: sessionUser.location || "",
        };

        console.log("🎯 Session token info:", {
          hasAccessToken: !!accessToken,
          accessTokenLength: accessToken?.length || 0,
          sessionUserToken: sessionUser.token,
          sessionAccessToken: (session as any).accessToken
        });

        // If we have a token from session
        if (accessToken && accessToken.length > 20) {
          console.log("✅ Found valid token in session");
          
          // Save to localStorage for persistence
          localStorage.setItem("token", accessToken);
          localStorage.setItem("user", JSON.stringify(userData));
          
          // Set API authorization header
          API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          
          setToken(accessToken);
          setUser(userData);
        } else if (storedToken && storedToken.length > 20) {
          // Fallback to stored token
          console.log("✅ Using stored token as fallback");
          API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          setToken(storedToken);
          setUser(userData);
        } else {
          // No token available
          console.warn("⚠️ No valid token found in session or localStorage");
          setUser(userData);
          setToken(null);
        }
        
        setInitialized(true);
        setLoading(false);
        return;
      }

      // No auth data found
      console.log("ℹ️ No auth data found, clearing");
      clearAllAuthData();
      setUser(null);
      setToken(null);
      setInitialized(true);
      setLoading(false);

    } catch (error) {
      console.error("❌ Auth initialization error:", error);
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
      console.log("🔓 Session became unauthenticated");
      clearAllAuthData();
    }
  }, [status, clearAllAuthData]);

  // Add API interceptor to automatically add token to requests
  useEffect(() => {
    const requestInterceptor = API.interceptors.request.use(
      (config) => {
        // Always try to get token from localStorage first
        const token = localStorage.getItem("token");
        
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("🔐 Adding auth header to request:", config.url);
        } else if (!config.headers.Authorization) {
          console.warn("⚠️ No auth token available for request:", config.url);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          console.log("🔄 Attempting token refresh for 401 error");
          
          try {
            const newToken = await refreshToken();
            if (newToken) {
              console.log("✅ Token refreshed successfully");
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return API(originalRequest);
            }
          } catch (refreshError) {
            console.error("❌ Token refresh failed:", refreshError);
            clearAllAuthData();
            window.location.href = "/auth/login";
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.request.eject(requestInterceptor);
      API.interceptors.response.eject(responseInterceptor);
    };
  }, [clearAllAuthData]);

  const refreshToken = async (): Promise<string | null> => {
    try {
      console.log("🔄 Attempting to refresh token...");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await API.post("/auth/refresh-token", { refreshToken });
      const data = response.data;

      if (data.success && data.data.token) {
        const newToken = data.data.token;
        const newRefreshToken = data.data.refreshToken;

        console.log("✅ Token refresh successful");
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
      console.error("❌ Token refresh error:", error);
      clearAllAuthData();
      return null;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      console.log("🔐 Attempting login for:", email);
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

      if (authToken.length < 20) {
        throw new Error("Invalid token received from server");
      }

      console.log("✅ Login successful, saving data...");
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
      console.error("❌ Login error:", error);
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
      console.error("❌ Registration error:", error);
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
      console.log("🔐 Starting Google login...");
      clearAllAuthData();
      
      // Use redirect: true for better compatibility with NextAuth
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("❌ Google sign-in error:", error);
      clearAllAuthData();
      return {
        success: false,
        message: error.message || "Google sign-in failed. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      console.log("👋 Logging out...");
      clearAllAuthData();
      
      await signOut({
        callbackUrl: "/auth/login",
        redirect: true,
      });
    } catch (error) {
      console.error("❌ Error during sign out:", error);
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