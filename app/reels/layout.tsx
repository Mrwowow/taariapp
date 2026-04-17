import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reels",
  description: "Short-form visual stories from the African Diaspora — culture, people, and cities in motion.",
  openGraph: { title: "TAARi Reels", description: "Short-form visual stories from the African Diaspora." },
};

export default function ReelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
