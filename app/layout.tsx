import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// FONT SETUP
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// KONFIGURASI DASAR WEBSITE
const SITE_NAME = "Aneka Distribusi";
const SITE_DESC = "Sistem manajemen dan distribusi produk yang cepat, efisien, dan modern.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://anekadistribusi.vercel.app";
const DEFAULT_OG = "/og-default.jpg"; 

// ✅ SEO GLOBAL
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s • ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  authors: [{ name: "Aneka Distribusi" }],
  creator: "Aneka Distribusi",
  publisher: "Aneka Distribusi",
  keywords: ["distribusi", "manajemen produk", "supply chain", "inventory", "penjualan", "gudang"],

  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESC,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESC,
    images: [DEFAULT_OG],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "Business",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// ✅ VIEWPORT (untuk warna address bar mobile)
export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
};

// ✅ ROOT LAYOUT
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
