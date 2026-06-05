import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "InvestArena — Virtual Stock Trading Simulator",
  description:
    "Learn investing with ₹10L virtual capital. Trade Indian stocks, get AI portfolio insights, and compete on global leaderboards — zero financial risk.",
  openGraph: {
    title: "InvestArena — Virtual Stock Trading Simulator",
    description:
      "Master trading with virtual money. AI mentor, live market data, and competitive leaderboards.",
    url: siteUrl,
    siteName: "InvestArena",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvestArena — Virtual Stock Trading Simulator",
    description:
      "Learn investing with ₹10L virtual capital. Trade, analyze, and compete risk-free.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
