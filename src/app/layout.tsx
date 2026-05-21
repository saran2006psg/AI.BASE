import type { Metadata } from "next";
import { Inter, Newsreader, Fira_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConvexClientProvider } from "./ConvexClientProvider";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  style: ["normal", "italic"],
  display: "swap",
});

const firaMono = Fira_Mono({ 
  weight: ["400", "500", "700"], 
  subsets: ["latin"], 
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowBase - The Playbook for using AI",
  description: "Curated AI workflows, copy-paste prompts, and step-by-step guides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${firaMono.variable}`}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column", margin: 0, position: "relative" }}>
        <ConvexClientProvider>
          {/* Viewport Backlight Halo Glow */}
          <div className="viewport-halo"></div>
          {/* Global background gradient overlay */}
          <div className="global-bg-gradient"></div>
          <Navbar />
          <main style={{ flex: 1, position: "relative", zIndex: 1 }}>{children}</main>
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
