import type { Metadata } from "next";
import { Inter, Space_Grotesk, Barlow_Condensed } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { GamificationProvider } from "@/context/GamificationContext";
import { RealTimeProvider } from "@/context/RealTimeContext";
import { AnimatedBackground } from '@/components/AnimatedBackground';

import MaintenanceBanner from '@/components/layout/MaintenanceBanner';
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
  metadataBase: new URL('https://devpath-website.web.app'),
  title: {
    default: "DevPath Community",
    template: "%s | DevPath Community",
  },
  description: "Join 50,000+ developers accelerating their coding skills through structured paths, real projects, and an active community.",
  keywords: ["DevPath", "Coding Community", "Developer Community", "Learn to Code", "Programming", "Software Engineering", "Web Development", "App Development"],
  authors: [{ name: "DevPath Team" }],
  creator: "DevPath Community",
  publisher: "DevPath Community",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devpath-website.web.app",
    title: "DevPath Community",
    description: "Join 50,000+ developers accelerating their coding skills through structured paths, real projects, and an active community.",
    siteName: "DevPath Community",
    images: [
      {
        url: "/DevPath-logo.png",
        width: 800,
        height: 600,
        alt: "DevPath Community Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPath Community",
    description: "Join 50,000+ developers accelerating their coding skills through structured paths, real projects, and an active community.",
    images: ["/DevPath-logo.png"],
    creator: "@DevPath_Community", // Assuming handle
  },
  icons: {
    icon: '/DevPath-logo.png',
    apple: '/DevPath-logo.png',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DevPath Community",
  "url": "https://devpath-website.web.app",
  "logo": "https://devpath-website.web.app/DevPath-logo.png",
  "sameAs": [
    "https://twitter.com/DevPath_Community",
    "https://www.linkedin.com/company/devpath-community",
    "https://github.com/DevPath-Community-Website"
  ],
  "description": "A community of 50,000+ developers accelerating their coding skills through structured paths and real projects."
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
          enableSystem={false}
          disableTransitionOnChange
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <AuthProvider>
            <GamificationProvider>
              <RealTimeProvider>
                <AnimatedBackground />
                {/* <BackgroundMesh /> */}
                <MaintenanceBanner />
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
