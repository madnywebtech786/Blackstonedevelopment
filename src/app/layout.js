import { Geist } from "next/font/google";
import { Oswald } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/navigation/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    template: "%s | Black Stone Basement Development Ltd",
    default: "Black Stone Basement Development Ltd — Calgary Carpet Cleaning, Drywall, Roofing & Siding",
  },
  description:
    "Black Stone Basement Development Ltd is a Calgary-area home services company specializing in carpet cleaning, renovation cleaning, drywall, roofing, and siding.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
