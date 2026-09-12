import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@repo/ui/globals.css";
import "./globals.css";
import { Toaster } from "@repo/ui/components/ui/sonner";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
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
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* Hidden element to ensure Sniglet is loaded for the Canvas text tool */}
        <div style={{ fontFamily: "Sniglet", position: "absolute", opacity: 0, pointerEvents: "none" }}>preload</div>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
