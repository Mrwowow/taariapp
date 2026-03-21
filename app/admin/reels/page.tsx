'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Reel } from '@/lib/store';

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/reels');
    setReels(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete reel "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/reels/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Reels
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{reels.length} total</p>
        </div>
        <Link
          href="/admin/reels/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
        >
          + New Reel
        </Link>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : reels.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-[#6B6B6B] text-sm shadow-sm border border-gray-100">
          No reels yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {reel.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">
                    ▶
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-medium text-[#1A1A1A] text-sm leading-snug">{reel.title}</p>
                <p className="text-xs text-[#6B6B6B] mt-1">{reel.city.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{reel.publishedAt}</p>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <Link
                  href={`/admin/reels/${reel.id}/edit`}
                  className="flex-1 text-center text-xs px-2 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(reel.id, reel.title)}
                  className="flex-1 text-xs px-2 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
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
