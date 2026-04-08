'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CityItem {
  id: string;
  name: string;
  slug: string;
  heroImage: string;
  description: string;
  storyCount: number;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/cities');
    setCities(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete city "${name}"? This will not remove associated articles/interviews. This cannot be undone.`)) return;
    await fetch(`/api/admin/cities/${id}`, { method: 'DELETE' });
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
            Cities
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{cities.length} total</p>
        </div>
        <Link
          href="/admin/cities/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
        >
          + New City
        </Link>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : cities.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-[#6B6B6B] text-sm shadow-sm border border-gray-100">
          No cities yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city) => (
            <div
              key={city.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Hero preview */}
              <div className="relative h-32 bg-gray-100">
                {city.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={city.heroImage} alt={city.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-[#1A1A1A]">{city.name}</h3>
                <p className="text-xs text-[#6B6B6B] mt-0.5">/{city.slug}</p>
                <p className="text-sm text-[#6B6B6B] mt-2 line-clamp-2">{city.description}</p>
                <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-2">
                  {city.storyCount} stories
                </span>

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/admin/cities/${city.id}/edit`}
                    className="flex-1 text-center text-xs px-2 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(city.id, city.name)}
                    className="flex-1 text-xs px-2 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
