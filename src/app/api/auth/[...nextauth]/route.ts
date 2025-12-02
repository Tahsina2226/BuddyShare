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
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    backendToken?: string;
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
          console.log("🔐 Attempting login to backend:", {
            url: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            email: credentials.email,
          });

          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
            }/auth/login`,
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
          console.log("Backend response:", data);

          if (!data.success) {
            throw new Error(data.message || "Login failed");
          }

          if (!data.data?.user || !data.data?.token) {
            throw new Error("Invalid response format from server");
          }

          const { user, token } = data.data;

          if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
            localStorage.setItem("auth_token", token);
            localStorage.setItem("access_token", token);
            localStorage.setItem("user", JSON.stringify(user));
          }

          return {
            id: user._id || user.id,
            email: user.email,
            name: user.name,
            role: user.role || "user",
            token: token,
            ...user,
          };
        } catch (error: any) {
          console.error("Auth error:", error);

          if (
            error.message.includes("Network") ||
            error.message.includes("fetch")
          ) {
            throw new Error(
              "Cannot connect to server. Please check if backend is running on http://localhost:5000"
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
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
    newUser: "/auth/register",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.backendToken = (user as any).token;
        token.accessToken = (user as any).token;

        if (typeof window !== "undefined" && (user as any).token) {
          localStorage.setItem("token", (user as any).token);
          localStorage.setItem("auth_token", (user as any).token);
          localStorage.setItem("access_token", (user as any).token);
        }
      }

      if (account?.provider === "google") {
        try {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
            }/auth/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: account.id_token,
                email: token.email,
                name: token.name,
              }),
            }
          );

          const data = await response.json();
          if (data.success) {
            token.id = data.data.user._id;
            token.role = data.data.user.role;
            token.backendToken = data.data.token;

            if (typeof window !== "undefined") {
              localStorage.setItem("token", data.data.token);
              localStorage.setItem("user", JSON.stringify(data.data.user));
            }
          }
        } catch (error) {
          console.error("Google auth backend sync error:", error);
        }
      }

      return token;
    },

    async session({ session, token }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.token = token.backendToken as string;
        session.accessToken = token.backendToken as string;
        session.backendToken = token.backendToken as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.includes("/auth/login") || url.includes("/api/auth")) {
        return `${baseUrl}/`;
      }
      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("User signed in:", user.email);
    },
    async signOut({ token, session }) {
      console.log("User signed out");
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
