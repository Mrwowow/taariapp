import type { Metadata } from "next";
import "./globals.css";
import PublicShell from "@/components/layout/PublicShell";

export const metadata: Metadata = {
  title: "TAARi – Documenting the African Diaspora",
  description:
    "A premium digital media platform documenting the African Diaspora across global cities through editorial photo essays, video reels, and cultural interviews.",
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
