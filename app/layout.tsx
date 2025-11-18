import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CA7RIEL & PACO AMOROSO",
  description: "TOP OF THE HILLS",
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
