import type { Metadata } from "next";
import { Poppins, EB_Garamond } from "next/font/google"
import "@repo/ui/globals.css";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-eb-garamond",
})

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
    <html lang="en" className="dark">
      <body className={`${poppins.variable} ${ebGaramond.variable} font-poppins antialiased`}>
        {/* Hidden element to ensure Sniglet is loaded for the Canvas text tool */}
        <div style={{ fontFamily: "Sniglet", position: "absolute", opacity: 0, pointerEvents: "none" }}>preload</div>
        {children}
      </body>
    </html>
  );
}
