import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Worth Today",
  description: "Historical CPI vs. T-Bill returns. See what your money was really worth — and what it could have become.",
  keywords: "inflation calculator, Treasury Bill calculator, CPI calculator, purchasing power, FRED data, historical money value",
  authors: [{ name: "Sirin Dudler" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Worth Today",
    title: "Worth Today",
    description: "Historical CPI vs. T-Bill returns. See what your money was really worth — and what it could have become.",
  },
  twitter: {
    card: "summary",
    title: "Worth Today",
    description: "Historical CPI vs. T-Bill returns. See what your money was really worth — and what it could have become.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
