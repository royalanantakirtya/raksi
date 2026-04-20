import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAKSI - Royal Ananta Kirtya Field Service",
  description: "Aplikasi Kunjungan Petugas Lapangan Royal Ananta Kirtya",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RAKSI - Royal Ananta Kirtya Field Service",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <AuthGuard>
          <Header />
          <main className="flex-1 max-w-lg mx-auto w-full">
            {children}
          </main>
          <BottomNav />
        </AuthGuard>
      </body>
    </html>
  );
}
