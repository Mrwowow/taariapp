import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Reels",
  description:
    "Short-form visual stories from the African Diaspora — culture, people, and cities in motion.",
  path: "/reels",
});

export default function ReelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
