"use client";

import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { label: "Cities", href: "/city/atlanta" },
  { label: "Stories", href: "/stories/the-sound-of-the-new-south" },
  { label: "Reels", href: "/reels" },
  { label: "Interviews", href: "/interviews" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-dark">
        <div className="mx-auto max-w-[1320px] px-4 md:px-6 flex items-center justify-between h-[64px]">
          <Link href="/" className="font-serif text-[26px] font-bold text-white tracking-tight shrink-0">
            TAARi
          </Link>

          {/* Center: Nav links with dividers */}
          <div className="hidden lg:flex items-center ml-10 border border-white/20 rounded-full px-2 py-1.5">
            {navLinks.map((link, i) => (
              <div key={link.href} className="flex items-center">
                <Link
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-1"
                >
                  {link.label}
                </Link>
                {i < navLinks.length - 1 && (
                  <span className="text-gray-600 text-xs">|</span>
                )}
              </div>
            ))}
            <span className="text-gray-600 text-xs ml-1">|</span>
            <button className="text-gray-400 hover:text-white transition-colors px-3 py-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <Link
              href="/submit"
              className="flex items-center gap-2 bg-green text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-green-dark transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Submit Your Story
            </Link>
            <Link
              href="#"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In
            </Link>
            <Link
              href="#"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 rounded-lg px-4 py-2.5 hover:border-gray-400 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Create An Account
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-white"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </>
  );
}
