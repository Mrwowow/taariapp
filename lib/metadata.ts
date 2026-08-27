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

/** Open Graph card dimensions — the 1.91:1 ratio X/Facebook/LinkedIn expect. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * Reshape a featured picture into a true 1200x630 social card.
 *
 * Portraits and squares would otherwise be letterboxed or centre-cropped by
 * each platform's own rules, so we ask the CDN for the exact card instead.
 * Cloudinary and Unsplash both resize via URL; anything else is passed through
 * untouched (the declared dimensions are then a best-effort hint).
 */
export function ogImageUrl(src: string): string {
  const url = abs(src);

  // Cloudinary: inject a transformation right after the /upload/ segment.
  // c_fill keeps the frame full-bleed, g_auto picks the most salient region
  // (faces in portraits), and f_auto/q_auto keep the payload small enough for
  // scrapers that cap the download size.
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const transform = `c_fill,g_auto,w_${OG_WIDTH},h_${OG_HEIGHT},f_auto,q_auto`;
    // Avoid double-applying if a transformation is already present.
    if (/\/upload\/c_fill,g_auto,w_\d+,h_\d+/.test(url)) return url;
    return url.replace("/upload/", `/upload/${transform}/`);
  }

  // Unsplash: replace any existing sizing params with an explicit crop.
  if (url.includes("images.unsplash.com")) {
    const [base] = url.split("?");
    return `${base}?w=${OG_WIDTH}&h=${OG_HEIGHT}&fit=crop&crop=faces,entropy&q=80&auto=format`;
  }

  return url;
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
  // Normalise the featured picture into a real 1200x630 card so the declared
  // og:image dimensions match the bytes actually served.
  const img = ogImageUrl(image || DEFAULT_IMAGE);
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
      images: [
        {
          url: img,
          secureUrl: img,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          alt: title,
          type: img.includes(".png") ? "image/png" : "image/jpeg",
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(authorName && { authors: [authorName] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [{ url: img, width: OG_WIDTH, height: OG_HEIGHT, alt: title }],
    },
  };
}
