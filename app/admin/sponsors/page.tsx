'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SponsorWithId {
  id: string;
  name: string;
  tagline: string;
  url: string;
  logo: string;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<SponsorWithId[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/sponsors');
    setSponsors(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete sponsor "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/sponsors/${id}`, { method: 'DELETE' });
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
            Sponsors
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{sponsors.length} total</p>
        </div>
        <Link
          href="/admin/sponsors/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
        >
          + New Sponsor
        </Link>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : sponsors.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-[#6B6B6B] text-sm shadow-sm border border-gray-100">
          No sponsors yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              {/* Logo placeholder */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-xl font-bold overflow-hidden">
                {sponsor.logo && !sponsor.logo.endsWith('.svg') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-cover" />
                ) : (
                  sponsor.name.charAt(0)
                )}
              </div>

              <h3 className="font-semibold text-[#1A1A1A]">{sponsor.name}</h3>
              <p className="text-sm text-[#6B6B6B] mt-1 italic">{sponsor.tagline}</p>
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C8956C] hover:underline mt-1 block truncate"
              >
                {sponsor.url}
              </a>

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/admin/sponsors/${sponsor.id}/edit`}
                  className="flex-1 text-center text-xs px-2 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(sponsor.id, sponsor.name)}
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
