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
  metadataBase: new URL("https://canvas-flow-web.vercel.app"),
  title: {
    default: "CanvasFlow | Real-time Collaborative Whiteboard",
    template: "%s | CanvasFlow",
  },
  description:
    "CanvasFlow is an open-source, real-time collaborative whiteboard and drawing tool. Sketch diagrams, wireframes, and brainstorm ideas seamlessly with your team.",
  keywords: [
    "whiteboard",
    "excalidraw clone",
    "collaborative drawing",
    "canvasflow",
    "real-time whiteboard",
    "drawing tool",
    "system design tool",
    "diagramming",
    "mind mapping",
    "visual collaboration",
  ],
  authors: [{ name: "Aman Verma" }],
  creator: "Aman Verma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://canvas-flow-web.vercel.app",
    title: "CanvasFlow | Real-time Collaborative Whiteboard",
    description:
      "Sketch diagrams, wireframes, and brainstorm ideas seamlessly with your team on CanvasFlow.",
    siteName: "CanvasFlow",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CanvasFlow - Real-time Collaborative Whiteboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CanvasFlow | Real-time Collaborative Whiteboard",
    description:
      "Sketch diagrams, wireframes, and brainstorm ideas seamlessly with your team on CanvasFlow.",
    creator: "@amanntwt",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${spaceMono.variable} font-sans antialiased scrollbar-hide`}>
        <div style={{ fontFamily: "Sniglet", position: "absolute", opacity: 0, pointerEvents: "none" }}>preload</div>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
