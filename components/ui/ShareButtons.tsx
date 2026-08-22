"use client";

import { useEffect, useState } from "react";

type Platform = "x" | "facebook" | "linkedin" | "whatsapp" | "email";

interface ShareButtonsProps {
  /** Path of the page being shared, e.g. `/stories/my-slug`. */
  path: string;
  /** Headline used as the share text on platforms that accept one. */
  title: string;
  /** Optional longer blurb used by email/WhatsApp bodies. */
  description?: string;
  /** Compact renders a smaller, borderless row for use inside cards. */
  variant?: "default" | "compact";
  className?: string;
}

const PLATFORMS: { key: Platform; label: string; icon: React.ReactNode }[] = [
  {
    key: "x",
    label: "Share on X",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Share on Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.025 1.792-4.696 4.533-4.696 1.313 0 2.686.236 2.686.236v2.966H15.83c-1.49 0-1.955.929-1.955 1.882v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "Share on LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
      </svg>
    ),
  },
  {
    key: "whatsapp",
    label: "Share on WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.199.05-.373-.025-.522-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.465 3.4" />
      </svg>
    ),
  },
  {
    key: "email",
    label: "Share by email",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="w-4 h-4">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

function buildShareUrl(platform: Platform, url: string, title: string, description: string): string {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  switch (platform) {
    case "x":
      return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
    case "email":
      return `mailto:?subject=${t}&body=${encodeURIComponent(`${description ? `${description}\n\n` : ""}${url}`)}`;
  }
}

export default function ShareButtons({
  path,
  title,
  description = "",
  variant = "default",
  className = "",
}: ShareButtonsProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Resolve the absolute URL on the client so it works on any host/preview
  // deployment; falls back to the configured site URL during SSR.
  useEffect(() => {
    setUrl(window.location.origin + path);
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, [path]);

  const shareUrl =
    url ||
    `${(process.env.NEXT_PUBLIC_SITE_URL || "https://taaridm.com").replace(/\/$/, "")}${path}`;

  function openShareWindow(e: React.MouseEvent<HTMLAnchorElement>, platform: Platform) {
    if (platform === "email") return; // let mailto: use the default handler
    e.preventDefault();
    window.open(
      buildShareUrl(platform, shareUrl, title, description),
      "_blank",
      "noopener,noreferrer,width=600,height=640"
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Clipboard API is unavailable (insecure context / older browser) —
      // fall back to a hidden textarea + execCommand.
      const el = document.createElement("textarea");
      el.value = shareUrl;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
  }

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function nativeShare() {
    try {
      await navigator.share({ title, text: description || title, url: shareUrl });
    } catch {
      // User dismissed the share sheet — nothing to do.
    }
  }

  const compact = variant === "compact";
  const btn = compact
    ? "w-7 h-7 rounded-full text-muted hover:text-accent"
    : "w-9 h-9 border border-border text-muted hover:text-accent hover:border-accent";
  const base = `flex items-center justify-center transition-colors ${btn}`;

  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-3"} ${className}`}>
      {!compact && (
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted mr-1">
          Share
        </span>
      )}

      {PLATFORMS.map(({ key, label, icon }) => (
        <a
          key={key}
          href={buildShareUrl(key, shareUrl, title, description)}
          onClick={(e) => openShareWindow(e, key)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={base}
        >
          {icon}
        </a>
      ))}

      {/* Copy link */}
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
        className={`${base} ${copied ? "text-accent border-accent" : ""}`}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="w-4 h-4">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="w-4 h-4">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>

      {/* Native share sheet — mobile only, where the OS provides one */}
      {canNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          aria-label="Share via device"
          title="Share via device"
          className={`${base} md:hidden`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="w-4 h-4">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="m16 6-4-4-4 4" />
            <path d="M12 2v13" />
          </svg>
        </button>
      )}

      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
