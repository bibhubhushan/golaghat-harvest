import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Noto_Sans_Bengali } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"] });
const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const Assamese = Noto_Sans_Bengali({ variable: "--font-assamese", subsets: ["bengali"], weight: ["400", "500", "600"] });

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") || incoming.get("host") || "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "Assam Harvest — Assamese Produce, Pantry and Craft";
  const description = "An ecommerce platform from Assam for fresh vegetables, distinctive pantry goods and Assamese craft.";

  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: [{ url: `${origin}/og-award.png`, width: 1200, height: 630, alt: "Assam Harvest — Food, pantry and craft from Assam" }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og-award.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${sans.variable} ${Assamese.variable}`}>{children}</body></html>;
}
