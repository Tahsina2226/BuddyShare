"use client";

import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            <div className="bg-gray-50 min-h-screen">{children}</div>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
