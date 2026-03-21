'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import type { Submission } from '@/lib/store';

interface Stats {
  articles: number;
  interviews: number;
  reels: number;
  sponsors: number;
  pendingSubmissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    async function load() {
      const [articlesRes, interviewsRes, reelsRes, sponsorsRes, submissionsRes] = await Promise.all([
        fetch('/api/admin/articles'),
        fetch('/api/admin/interviews'),
        fetch('/api/admin/reels'),
        fetch('/api/admin/sponsors'),
        fetch('/api/admin/submissions'),
      ]);
      const [articles, interviews, reels, sponsors, submissions] = await Promise.all([
        articlesRes.json(),
        interviewsRes.json(),
        reelsRes.json(),
        sponsorsRes.json(),
        submissionsRes.json(),
      ]);
      setStats({
        articles: articles.length,
        interviews: interviews.length,
        reels: reels.length,
        sponsors: sponsors.length,
        pendingSubmissions: submissions.filter((s: Submission) => s.status === 'pending').length,
      });
      setRecentSubmissions(
        [...submissions]
          .sort((a: Submission, b: Submission) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          )
          .slice(0, 5),
      );
    }
    load();
  }, []);

  const statCards = [
    { label: 'Articles', value: stats?.articles, href: '/admin/articles', color: 'text-[#1A1A1A]' },
    { label: 'Interviews', value: stats?.interviews, href: '/admin/interviews', color: 'text-[#1A1A1A]' },
    { label: 'Reels', value: stats?.reels, href: '/admin/reels', color: 'text-[#1A1A1A]' },
    { label: 'Pending Submissions', value: stats?.pendingSubmissions, href: '/admin/submissions', color: 'text-yellow-600' },
    { label: 'Sponsors', value: stats?.sponsors, href: '/admin/sponsors', color: 'text-[#1A1A1A]' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Dashboard
        </h1>
        <p className="text-[#6B6B6B] mt-1 text-sm">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <p
                className={`text-3xl font-bold ${card.color}`}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {stats === null ? '—' : card.value}
              </p>
              <p className="text-sm text-[#6B6B6B] mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/articles/new"
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
          >
            + New Article
          </Link>
          <Link
            href="/admin/interviews/new"
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
          >
            + New Interview
          </Link>
          <Link
            href="/admin/reels/new"
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
          >
            + New Reel
          </Link>
          <Link
            href="/admin/sponsors/new"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            + New Sponsor
          </Link>
        </div>
      </div>

      {/* Recent submissions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Recent Submissions</h2>
          <Link
            href="/admin/submissions"
            className="text-sm text-[#C8956C] hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <p className="text-[#6B6B6B] text-sm py-4">No submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {recentSubmissions.map((sub) => (
              <Link key={sub.id} href={`/admin/submissions/${sub.id}`}>
                <div className="flex items-center justify-between py-3 border-b border-gray-50 hover:bg-gray-50 px-2 -mx-2 rounded transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{sub.name}</p>
                    <p className="text-xs text-[#6B6B6B] truncate">
                      {sub.city} · {sub.summary.slice(0, 60)}…
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <StatusBadge status={sub.status} />
                    <span className="text-xs text-[#6B6B6B]">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
