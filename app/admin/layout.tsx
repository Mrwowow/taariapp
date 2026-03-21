'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '▣' },
  { label: 'Articles', href: '/admin/articles', icon: '✦' },
  { label: 'Interviews', href: '/admin/interviews', icon: '◈' },
  { label: 'Reels', href: '/admin/reels', icon: '▶' },
  { label: 'Submissions', href: '/admin/submissions', icon: '◎' },
  { label: 'Sponsors', href: '/admin/sponsors', icon: '◆' },
  { label: 'Users', href: '/admin/users', icon: '◉' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <div className="bg-[#F8F8F8] text-[#1A1A1A] antialiased font-[Inter,sans-serif]">
      <div className="flex h-screen overflow-hidden">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-30
              w-64 bg-[#1A1A1A] flex flex-col
              transform transition-transform duration-200 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Logo */}
            <div className="px-6 py-6 border-b border-white/10">
              <Link href="/admin" className="block">
                <span
                  className="text-2xl font-bold text-white tracking-wider"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  TAARi
                </span>
                <span className="block text-xs text-[#6B6B6B] mt-0.5 tracking-widest uppercase">
                  Admin
                </span>
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                      ${
                        active
                          ? 'border-l-2 border-[#C8956C] bg-white/5 text-white pl-[10px]'
                          : 'text-[#9A9A9A] hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                      }
                    `}
                  >
                    <span className="text-base leading-none">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-white transition-colors"
              >
                <span>View Site</span>
                <span>→</span>
              </Link>
            </div>
          </aside>

          {/* Main area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile top bar */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-white/10">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-white p-1"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                TAARi Admin
              </span>
              <div className="w-8" />
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
    </div>
  );
}
