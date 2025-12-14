import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ActivityFeed from "@/components/ui/ActivityFeed";
import { AuthProvider } from "@/context/AuthContext";
import { GamificationProvider } from "@/context/GamificationContext";
import { RealTimeProvider } from "@/context/RealTimeContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevPath | Master Your Developer Journey",
  description: "Join 50,000+ developers accelerating their coding skills through structured paths, real projects, and an active community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <GamificationProvider>
            <RealTimeProvider>
              <Navbar />
              {children}
              <ActivityFeed />
              <Footer />
            </RealTimeProvider>
          </GamificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
