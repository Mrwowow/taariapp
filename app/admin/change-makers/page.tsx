'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ChangeMakerItem {
  id: string;
  name: string;
  title: string;
  photo: string;
  category: string;
  city: string;
  year: number;
  featured: boolean;
}

export default function ChangeMakersPage() {
  const [makers, setMakers] = useState<ChangeMakerItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/change-makers');
    setMakers(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete change maker "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/change-makers/${id}`, { method: 'DELETE' });
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
            Change Makers
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{makers.length} total</p>
        </div>
        <Link
          href="/admin/change-makers/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
        >
          + New Change Maker
        </Link>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : makers.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-[#6B6B6B] text-sm shadow-sm border border-gray-100">
          No change makers yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {makers.map((maker) => (
            <div
              key={maker.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              {/* Photo */}
              <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-gray-400 text-xl font-bold overflow-hidden">
                {maker.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={maker.photo} alt={maker.name} className="w-full h-full object-cover" />
                ) : (
                  maker.name.charAt(0)
                )}
              </div>

              <h3 className="font-semibold text-[#1A1A1A]">{maker.name}</h3>
              <p className="text-sm text-[#6B6B6B] mt-0.5">{maker.title}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-[#C8956C]/10 text-[#C8956C] px-2 py-0.5 rounded-full">{maker.category}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{maker.city}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{maker.year}</span>
                {maker.featured && (
                  <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">Featured</span>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/admin/change-makers/${maker.id}/edit`}
                  className="flex-1 text-center text-xs px-2 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(maker.id, maker.name)}
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
