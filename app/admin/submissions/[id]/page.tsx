'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import type { Submission } from '@/lib/store';

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`/api/admin/submissions/${id}`);
    if (res.ok) setSubmission(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function updateStatus(status: Submission['status']) {
    await fetch(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (loading) return <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>;
  if (!submission) return <div className="text-[#6B6B6B] text-sm py-8 text-center">Submission not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/admin/submissions" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Submissions
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {submission.name}
        </h1>
      </div>

      {/* Status + actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={submission.status} />
            <span className="text-sm text-[#6B6B6B]">
              Submitted {new Date(submission.submittedAt).toLocaleString()}
            </span>
          </div>
          <div className="flex gap-2">
            {submission.status !== 'approved' && (
              <button
                onClick={() => updateStatus('approved')}
                className="text-sm px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors font-medium"
              >
                Approve
              </button>
            )}
            {submission.status !== 'rejected' && (
              <button
                onClick={() => updateStatus('rejected')}
                className="text-sm px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors font-medium"
              >
                Reject
              </button>
            )}
            {submission.status !== 'pending' && (
              <button
                onClick={() => updateStatus('pending')}
                className="text-sm px-4 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-100 transition-colors font-medium"
              >
                Mark Pending
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Name</p>
            <p className="text-sm text-[#1A1A1A] font-medium">{submission.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
            <a
              href={`mailto:${submission.email}`}
              className="text-sm text-[#C8956C] hover:underline"
            >
              {submission.email}
            </a>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">City</p>
            <p className="text-sm text-[#1A1A1A]">{submission.city}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Social Handles
            </p>
            <p className="text-sm text-[#1A1A1A]">{submission.socialHandles || '—'}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Summary</p>
          <p className="text-sm text-[#1A1A1A] leading-relaxed bg-gray-50 rounded-lg p-4">
            {submission.summary}
          </p>
        </div>

        {submission.videoLink && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Video Link
            </p>
            <a
              href={submission.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#C8956C] hover:underline break-all"
            >
              {submission.videoLink}
            </a>
          </div>
        )}

        {submission.imageUrls && submission.imageUrls.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Images ({submission.imageUrls.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {submission.imageUrls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`Submission image ${i + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
