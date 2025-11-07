import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Worth Today - Inflation & Investment Calculator",
  description: "Calculate the real value of money over time using inflation adjustment and Treasury Bill investment returns",
  keywords: "inflation calculator, Treasury Bill calculator, CPI calculator, investment calculator, money value calculator, purchasing power, FRED data",
  authors: [{ name: "Worth Today" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Worth Today",
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
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
