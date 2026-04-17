import type { Metadata } from "next";
import "./globals.css";
import PublicShell from "@/components/layout/PublicShell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taariapp.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TAARi – Documenting the African Diaspora",
    template: "%s — TAARi",
  },
  description:
    "A premium digital media platform documenting the African Diaspora across global cities through editorial photo essays, video reels, and cultural interviews.",
  openGraph: {
    type: "website",
    siteName: "TAARi",
    locale: "en_US",
    images: [{ url: "/images/taari1200x630.png", width: 1200, height: 630, alt: "TAARi" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/taari1200x630.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-dark antialiased">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
