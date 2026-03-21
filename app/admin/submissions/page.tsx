'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import type { Submission } from '@/lib/store';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/submissions');
    setSubmissions(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: Submission['status']) {
    await fetch(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const columns = [
    {
      header: 'Name',
      cell: (s: Submission) => (
        <Link
          href={`/admin/submissions/${s.id}`}
          className="font-medium text-[#1A1A1A] hover:text-[#C8956C] transition-colors"
        >
          {s.name}
        </Link>
      ),
    },
    {
      header: 'Email',
      cell: (s: Submission) => <span className="text-[#6B6B6B] text-xs">{s.email}</span>,
    },
    {
      header: 'City',
      cell: (s: Submission) => <span className="text-[#6B6B6B]">{s.city}</span>,
    },
    {
      header: 'Summary',
      cell: (s: Submission) => (
        <span className="text-[#6B6B6B] text-xs">
          {s.summary.length > 70 ? `${s.summary.slice(0, 70)}…` : s.summary}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (s: Submission) => <StatusBadge status={s.status} />,
    },
    {
      header: 'Date',
      cell: (s: Submission) => (
        <span className="text-[#6B6B6B] text-xs whitespace-nowrap">
          {new Date(s.submittedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (s: Submission) => (
        <div className="flex items-center gap-1.5">
          {s.status !== 'approved' && (
            <button
              onClick={() => updateStatus(s.id, 'approved')}
              className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors whitespace-nowrap"
            >
              Approve
            </button>
          )}
          {s.status !== 'rejected' && (
            <button
              onClick={() => updateStatus(s.id, 'rejected')}
              className="text-xs px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
            >
              Reject
            </button>
          )}
          {s.status !== 'pending' && (
            <button
              onClick={() => updateStatus(s.id, 'pending')}
              className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-100 transition-colors"
            >
              Pending
            </button>
          )}
          <Link
            href={`/admin/submissions/${s.id}`}
            className="text-xs px-2 py-1 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            View
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1
          className="text-3xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Submissions
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          {submissions.filter((s) => s.status === 'pending').length} pending ·{' '}
          {submissions.length} total
        </p>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : (
        <AdminTable columns={columns} data={submissions} emptyMessage="No submissions yet." />
      )}
    </div>
  );
}
