'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PartnershipItem {
  id: string;
  name: string;
  logo: string;
  description: string;
  url: string;
  type: string;
  sortOrder: number;
  active: boolean;
}

export default function PartnershipsAdminPage() {
  const [partnerships, setPartnerships] = useState<PartnershipItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/partnerships');
    setPartnerships(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete partnership "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/partnerships/${id}`, { method: 'DELETE' });
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
            Partnerships
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{partnerships.length} total</p>
        </div>
        <Link
          href="/admin/partnerships/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
        >
          + New Partnership
        </Link>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : partnerships.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-[#6B6B6B] text-sm shadow-sm border border-gray-100">
          No partnerships yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partnerships.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xl font-bold overflow-hidden shrink-0">
                  {partner.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
                  ) : (
                    partner.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#1A1A1A] truncate">{partner.name}</h3>
                  <p className="text-xs text-[#C8956C]">{partner.type}</p>
                </div>
              </div>

              {partner.description && (
                <p className="text-sm text-[#6B6B6B] line-clamp-2 mb-2">{partner.description}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                <span className={`inline-block w-2 h-2 rounded-full ${partner.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                {partner.active ? 'Active' : 'Inactive'}
                <span className="mx-1">·</span>
                Order: {partner.sortOrder}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/partnerships/${partner.id}/edit`}
                  className="flex-1 text-center text-xs px-2 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(partner.id, partner.name)}
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
