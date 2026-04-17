import type { Metadata } from "next";

const SITE_NAME = "TAARi";
const DEFAULT_DESCRIPTION =
  "A premium digital media platform documenting the African Diaspora across global cities through editorial photo essays, video reels, and cultural interviews.";
const DEFAULT_IMAGE = "/images/taari1200x630.png";

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://taariapp.vercel.app"
  );
}

function truncate(text: string, max = 160): string {
  const clean = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}

function abs(path: string): string {
  if (path.startsWith("http")) return path;
  return `${siteUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
}

interface BuildMetadataArgs {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  authorName?: string;
}

export function buildMetadata({
  title,
  description,
  image,
  path,
  type = "website",
  publishedTime,
  authorName,
}: BuildMetadataArgs): Metadata {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} — ${SITE_NAME}`;
  const desc = truncate(description || DEFAULT_DESCRIPTION);
  const img = abs(image || DEFAULT_IMAGE);
  const url = path ? abs(path) : siteUrl();

  return {
    title: fullTitle,
    description: desc,
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: type === "article" ? "article" : type === "profile" ? "profile" : "website",
      images: [{ url: img, width: 1200, height: 630, alt: title }],
      ...(publishedTime && { publishedTime }),
      ...(authorName && { authors: [authorName] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [img],
    },
  };
}
