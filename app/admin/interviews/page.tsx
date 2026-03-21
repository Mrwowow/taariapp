'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminTable from '@/components/admin/AdminTable';
import type { Interview } from '@/lib/store';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/interviews');
    setInterviews(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(slug: string, name: string) {
    if (!window.confirm(`Delete interview with "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/interviews/${slug}`, { method: 'DELETE' });
    load();
  }

  const columns = [
    {
      header: 'Name',
      cell: (i: Interview) => <span className="font-medium text-[#1A1A1A]">{i.name}</span>,
    },
    {
      header: 'City',
      cell: (i: Interview) => <span className="text-[#6B6B6B]">{i.city.name}</span>,
    },
    {
      header: 'One-liner',
      cell: (i: Interview) => (
        <span className="text-[#6B6B6B] italic">&ldquo;{i.oneLiner}&rdquo;</span>
      ),
    },
    {
      header: 'Published',
      cell: (i: Interview) => (
        <span className="text-[#6B6B6B] whitespace-nowrap">{i.publishedAt}</span>
      ),
    },
    {
      header: 'Actions',
      cell: (i: Interview) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/interviews/${i.slug}/edit`}
            className="text-xs px-3 py-1 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(i.slug, i.name)}
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
            Interviews
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{interviews.length} total</p>
        </div>
        <Link
          href="/admin/interviews/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
        >
          + New Interview
        </Link>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : (
        <AdminTable columns={columns} data={interviews} emptyMessage="No interviews yet." />
      )}
    </div>
  );
}
