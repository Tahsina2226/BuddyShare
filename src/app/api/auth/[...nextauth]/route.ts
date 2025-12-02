import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
          // Replace this with your actual API call
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

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          if (data.success) {
            // Return user object that will be encoded in the JWT
            return {
              id: data.data.user._id || data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.name,
              role: data.data.user.role,
              ...data.data.user,
            };
          } else {
            throw new Error(data.message || "Invalid credentials");
          }
        } catch (error: any) {
          console.error("Auth error:", error);

          // Provide more specific error messages
          if (
            error.message.includes("Network") ||
            error.message.includes("fetch")
          ) {
            throw new Error("Server connection failed. Please try again.");
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
    signOut: "/",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.sub || (token.id as string);
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Persist user data to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt", // Using JWT strategy for better security
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Enable debug in development
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
