'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import type { Article } from '@/lib/store';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/articles');
    setArticles(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(slug: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/articles/${slug}`, { method: 'DELETE' });
    load();
  }

  const columns = [
    {
      header: 'Title',
      cell: (a: Article) => (
        <span className="font-medium text-[#1A1A1A]">{a.title}</span>
      ),
    },
    {
      header: 'City',
      cell: (a: Article) => <span className="text-[#6B6B6B]">{a.city.name}</span>,
    },
    {
      header: 'Categories',
      cell: (a: Article) => (
        <span className="text-[#6B6B6B]">{a.categories.join(', ')}</span>
      ),
    },
    {
      header: 'Author',
      cell: (a: Article) => <span className="text-[#6B6B6B]">{a.author.name}</span>,
    },
    {
      header: 'Published',
      cell: (a: Article) => (
        <span className="text-[#6B6B6B] whitespace-nowrap">{a.publishedAt}</span>
      ),
    },
    {
      header: 'Sponsored',
      cell: (a: Article) =>
        a.isSponsored ? <StatusBadge status="sponsored" /> : <span className="text-gray-300">—</span>,
    },
    {
      header: 'Actions',
      cell: (a: Article) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/articles/${a.slug}/edit`}
            className="text-xs px-3 py-1 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(a.slug, a.title)}
            className="text-xs px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
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
            Articles
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{articles.length} total</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
        >
          + New Article
        </Link>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : (
        <AdminTable columns={columns} data={articles} emptyMessage="No articles yet." />
      )}
    </div>
  );
}
