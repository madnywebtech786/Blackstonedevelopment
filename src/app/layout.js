import { Geist } from "next/font/google";
import { Oswald } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/navigation/WhatsAppButton";
import { siteConfig } from "@/lib/site-config";
import { getLocalBusinessSchema } from "@/lib/schema";

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
  metadataBase: new URL(siteConfig.url),
  title: {
    template: "%s | Black Stone Basement Development Ltd",
    default: "Black Stone Basement Development Ltd: Calgary Basement Renovation, Drywall Roofing & Siding Experts",
  },
  description:
    "Black Stone Basement Development Ltd is a Calgary basement renovation contractor specializing in basement development, drywall, carpet cleaning, roofing, and siding.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
