'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Submission } from '@/lib/store';

interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-[#FEF9E7]', text: 'text-[#92780C]', label: 'Pending' },
  approved: { bg: 'bg-[#E8F5E9]', text: 'text-[#2E7D32]', label: 'Approved' },
  rejected: { bg: 'bg-[#FDEDEB]', text: 'text-[#C0392B]', label: 'Rejected' },
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        router.push('/login');
        return;
      }
      const { user: u } = await meRes.json();
      setUser(u);

      const subRes = await fetch('/api/user/submissions');
      if (subRes.ok) {
        setSubmissions(await subRes.json());
      }
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <p className="text-muted text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-[800px]">
        {/* User Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-dark">{user.name}</h1>
              <p className="text-muted text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Submissions Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-dark">My Submissions</h2>
            <p className="text-muted text-sm mt-1">
              {submissions.length === 0
                ? 'You haven\'t submitted any stories yet.'
                : `${submissions.length} submission${submissions.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <Link
            href="/submit"
            className="bg-dark text-cream text-xs font-medium uppercase tracking-[0.1em] px-6 py-3 hover:bg-accent transition-colors"
          >
            Submit a Story
          </Link>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="border border-border rounded-2xl p-12 text-center">
            <p className="text-muted mb-4">Share your story with the TAARi community.</p>
            <Link
              href="/submit"
              className="inline-block bg-dark text-cream text-xs font-medium uppercase tracking-[0.1em] px-8 py-4 hover:bg-accent transition-colors"
            >
              Submit Your Story
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const status = STATUS_STYLES[sub.status] ?? STATUS_STYLES.pending;
              return (
                <div
                  key={sub.id}
                  className="border border-border rounded-xl p-6 hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-muted">
                          {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-dark">{sub.city}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-3">
                    {sub.summary}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                    {sub.videoLink && (
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                        Video attached
                      </span>
                    )}
                    {sub.imageUrls && sub.imageUrls.length > 0 && (
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21,15 16,10 5,21" />
                        </svg>
                        {sub.imageUrls.length} image{sub.imageUrls.length === 1 ? '' : 's'}
                      </span>
                    )}
                    {sub.socialHandles && (
                      <span>{sub.socialHandles}</span>
                    )}
                  </div>

                  {/* Image thumbnails */}
                  {sub.imageUrls && sub.imageUrls.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {sub.imageUrls.map((url, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={url}
                          alt={`Submission image ${i + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
