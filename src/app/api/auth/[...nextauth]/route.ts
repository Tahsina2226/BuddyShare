import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      token?: string;
    };
    accessToken?: string;
    backendToken?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    token?: string;
    location?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    backendToken?: string;
    location?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          console.log("🔐 Attempting credentials login for:", credentials.email);
          
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await response.json();
          console.log("Backend login response:", data);

          if (!data.success) {
            throw new Error(data.message || "Login failed");
          }

          if (!data.data?.user || !data.data?.token) {
            throw new Error("Invalid response format from server");
          }

          const { user, token } = data.data;

          // Save to localStorage if in browser
          if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            console.log("✅ Saved auth data to localStorage");
          }

          return {
            id: user._id || user.id,
            email: user.email,
            name: user.name,
            role: user.role || "user",
            location: user.location || "",
            token: token,
          };
        } catch (error: any) {
          console.error("❌ Auth error:", error);
          
          if (
            error.message.includes("Network") ||
            error.message.includes("fetch")
          ) {
            throw new Error(
              "Cannot connect to server. Please check if backend is running"
            );
          }

          if (error.message.includes("JSON")) {
            throw new Error(
              "Invalid server response. Please check backend configuration."
            );
          }

          throw new Error(error.message || "Invalid email or password");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
    newUser: "/auth/register",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 SignIn callback triggered:", {
        provider: account?.provider,
        email: user.email,
        hasAccount: !!account
      });

      if (account?.provider === "google") {
        try {
          console.log("🔐 Processing Google sign-in...");
          
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: account.id_token,
                email: user.email,
                name: user.name,
              }),
            }
          );

          const data = await response.json();
          console.log("Google backend response:", data);

          if (data.success && data.data?.token) {
            // Update user object with backend data
            user.id = data.data.user._id || data.data.user.id;
            user.role = data.data.user.role;
            user.token = data.data.token;
            user.location = data.data.user.location || "";

            // Save to localStorage immediately
            if (typeof window !== "undefined") {
              localStorage.setItem("token", data.data.token);
              localStorage.setItem("user", JSON.stringify(data.data.user));
              console.log("✅ Google auth data saved to localStorage");
            }
            
            return true;
          } else {
            console.error("Google backend auth failed:", data.message);
            return false;
          }
        } catch (error) {
          console.error("❌ Google auth backend sync error:", error);
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      console.log("🔐 JWT callback:", { 
        hasUser: !!user, 
        provider: account?.provider,
        trigger 
      });

      // Initial sign in
      if (user) {
        console.log("🔐 Setting JWT from user:", { 
          id: user.id, 
          role: (user as any).role,
          hasToken: !!(user as any).token
        });
        
        token.id = user.id;
        token.role = (user as any).role;
        token.backendToken = (user as any).token;
        token.accessToken = (user as any).token;
        token.location = (user as any).location || "";

        // Save to localStorage if token exists
        if (typeof window !== "undefined" && (user as any).token) {
          localStorage.setItem("token", (user as any).token);
          localStorage.setItem("user", JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user as any).role || "user",
            location: (user as any).location || "",
            token: (user as any).token
          }));
          console.log("✅ JWT saved auth data to localStorage");
        }
      }

      // Handle session updates
      if (trigger === "update" && session?.user) {
        console.log("🔐 Updating JWT from session update");
        token.id = session.user.id;
        token.role = session.user.role;
        token.backendToken = session.user.token;
        token.accessToken = session.user.token;
      }

      return token;
    },

    async session({ session, token }): Promise<Session> {
      console.log("🔐 Session callback:", { 
        userId: token.id, 
        hasToken: !!token.backendToken 
      });

      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        
        // Ensure token is passed from JWT to session
        const backendToken = token.backendToken as string;
        session.user.token = backendToken;
        session.accessToken = backendToken;
        session.backendToken = backendToken;

        console.log("🔐 Setting session data:", {
          userId: session.user.id,
          role: session.user.role,
          hasToken: !!backendToken,
          tokenLength: backendToken?.length || 0
        });

        // Immediately save to localStorage when session is created
        if (typeof window !== "undefined" && backendToken) {
          try {
            localStorage.setItem("token", backendToken);
            localStorage.setItem("user", JSON.stringify({
              id: token.id,
              name: token.name,
              email: token.email,
              role: token.role || "user",
              location: token.location || "",
              token: backendToken
            }));
            console.log("✅ Session saved auth data to localStorage");
          } catch (error) {
            console.error("❌ Error saving to localStorage:", error);
          }
        }
      }
      
      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log("🔐 Redirect callback:", { url, baseUrl });
      
      // If trying to access auth pages while logged in, redirect to home
      if (url.includes("/auth/login") || url.includes("/api/auth")) {
        return `${baseUrl}/dashboard`;
      }
      
      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("✅ User signed in:", { 
        email: user.email, 
        provider: account?.provider,
        isNewUser 
      });
    },
    async signOut({ token, session }) {
      console.log("👋 User signed out");
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          console.log("✅ Cleared localStorage on sign out");
        } catch (error) {
          console.error("❌ Error clearing localStorage:", error);
        }
      }
    },
    async session({ session, token }) {
      console.log("🔐 Session event:", { 
        email: session.user.email,
        userId: session.user.id 
      });
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };