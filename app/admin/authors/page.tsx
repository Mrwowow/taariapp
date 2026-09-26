'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminTable from '@/components/admin/AdminTable';
import type { AdminAuthor } from '@/lib/store';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<AdminAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/authors');
    setAuthors(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete author "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/authors/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      window.alert(data.error || `Could not delete "${name}".`);
    }
    load();
  }

  const columns = [
    {
      header: 'Author',
      cell: (a: AdminAuthor) => (
        <div className="flex items-center gap-3">
          {a.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center">
              {a.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <p className="font-medium text-[#1A1A1A]">{a.name}</p>
            <p className="text-xs text-[#6B6B6B]">/{a.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Bio',
      cell: (a: AdminAuthor) => <span className="text-[#6B6B6B] line-clamp-2 max-w-md">{a.bio || '—'}</span>,
    },
    {
      header: 'Articles',
      cell: (a: AdminAuthor) => <span className="text-[#6B6B6B]">{a.articleCount}</span>,
    },
    {
      header: 'Actions',
      cell: (a: AdminAuthor) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/authors/${a.id}/edit`}
            className="text-xs px-3 py-1 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(a.id, a.name)}
            disabled={a.articleCount > 0}
            title={a.articleCount > 0 ? 'Reassign this author’s articles before deleting' : undefined}
            className="text-xs px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Authors
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{authors.length} total</p>
        </div>
        <Link
          href="/admin/authors/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
        >
          + New Author
        </Link>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : (
        <AdminTable columns={columns} data={authors} emptyMessage="No authors yet." />
      )}
    </div>
  );
}
