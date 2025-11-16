import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GM - Generative Micro-scenes",
  description: "Interactive 3D generative micro-scenes powered by Three.js and Next.js",
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
