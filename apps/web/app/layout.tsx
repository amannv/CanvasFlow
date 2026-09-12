import type { Metadata } from "next";
import { Poppins, Space_Mono } from "next/font/google";
import "@repo/ui/globals.css";
import "./globals.css";
import { Toaster } from "@repo/ui/components/ui/sonner";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "CanvasFlow",
  description: "Excalidraw Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${spaceMono.variable} font-sans antialiased`}>
        {/* Hidden element to ensure Sniglet is loaded for the Canvas text tool */}
        <div style={{ fontFamily: "Sniglet", position: "absolute", opacity: 0, pointerEvents: "none" }}>preload</div>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
