import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Lato,
  Crimson_Pro,
  Dancing_Script,
} from "next/font/google";
import ComingSoonPage from "@/components/ComingSoonPage";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Chihili || Coming Soon",
  description: "Chihili user panel is coming soon.",
};

export default function RootLayout({
  children: _children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} ${crimsonPro.variable} ${dancingScript.variable} antialiased`}
      >
        <ComingSoonPage />
      </body>
    </html>
  );
}
