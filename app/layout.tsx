import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
