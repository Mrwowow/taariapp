"use client";

import Link from "next/link";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

export default function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 h-[64px] border-b border-gray-200">
        <span className="font-serif text-[26px] font-bold text-dark">TAARi</span>
        <button onClick={onClose} className="p-2" aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <nav className="flex flex-col px-6 pt-6">
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={onClose} className="text-lg font-medium text-dark py-3 border-b border-gray-100">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-6 space-y-3">
        <Link href="/submit" onClick={onClose} className="flex items-center justify-center gap-2 bg-green text-white text-sm font-medium w-full py-3 rounded-lg">
          Submit Your Story
        </Link>
        <div className="flex gap-3">
          <Link href="/login" onClick={onClose} className="flex-1 text-center text-sm font-medium text-gray-600 py-3 border border-gray-200 rounded-lg">Sign In</Link>
          <Link href="/register" onClick={onClose} className="flex-1 text-center text-sm font-medium text-gray-600 py-3 border border-gray-200 rounded-lg">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
