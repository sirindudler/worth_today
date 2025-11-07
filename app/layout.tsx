import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Worth Today - Inflation & Investment Calculator",
  description: "Calculate the real value of money over time using inflation adjustment and Treasury Bill investment returns",
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
