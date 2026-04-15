'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Banner } from '@/lib/store';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/banners');
    setBanners(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete banner "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    load();
  }

  async function toggleActive(banner: Banner) {
    await fetch(`/api/admin/banners/${banner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !banner.active }),
    });
    load();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Hero Banners
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">
            {banners.length} total · {banners.filter((b) => b.active).length} active
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
        >
          + New Banner
        </Link>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-[#6B6B6B] text-sm shadow-sm border border-gray-100">
          No banners yet. Create one to display on the home page hero slider.
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center hover:shadow-md transition-shadow"
            >
              <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {banner.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {banner.badge && (
                    <span className="inline-block bg-[#C8956C] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {banner.badge}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">Order: {banner.sortOrder}</span>
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded transition-colors ${
                      banner.active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {banner.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <h3 className="font-semibold text-[#1A1A1A] truncate">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="text-sm text-[#6B6B6B] truncate">{banner.subtitle}</p>
                )}
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/admin/banners/${banner.id}/edit`}
                  className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(banner.id, banner.title)}
                  className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
