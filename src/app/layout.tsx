import type { Metadata } from "next";
import { Inter, Space_Grotesk, Barlow_Condensed } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { GamificationProvider } from "@/context/GamificationContext";
import { RealTimeProvider } from "@/context/RealTimeContext";
import { AnimatedBackground } from '@/components/AnimatedBackground';

import BackgroundMesh from '@/components/layout/BackgroundMesh';
import PageWrapper from '@/components/layout/PageWrapper';
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });
const barlowCondensed = Barlow_Condensed({
  weight: ['900'],
  subsets: ['latin'],
  variable: '--font-barlow'
});

export const metadata: Metadata = {
  title: "DevPath",
  description: "Join 50,000+ developers accelerating their coding skills through structured paths, real projects, and an active community.",
  icons: {
    icon: '/DevPath-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${barlowCondensed.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <GamificationProvider>
              <RealTimeProvider>
                <AnimatedBackground />
                {/* <BackgroundMesh /> */}
                <Navbar />
                <PageWrapper>
                  {children}
                </PageWrapper>
                <FooterWrapper />
              </RealTimeProvider>
            </GamificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
