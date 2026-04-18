'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  email: string;
  linkedIn: string;
  sortOrder: number;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/team-members');
    setMembers(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete team member "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/team-members/${id}`, { method: 'DELETE' });
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
            Team Members
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{members.length} total</p>
        </div>
        <Link
          href="/admin/team-members/new"
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors"
        >
          + New Member
        </Link>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-[#6B6B6B] text-sm shadow-sm border border-gray-100">
          No team members yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-gray-400 text-xl font-bold overflow-hidden">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  member.name.charAt(0)
                )}
              </div>

              <h3 className="font-semibold text-[#1A1A1A]">{member.name}</h3>
              <p className="text-sm text-[#C8956C] mt-0.5">{member.role}</p>
              {member.bio && (
                <p className="text-sm text-[#6B6B6B] mt-2 line-clamp-2">{member.bio}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">Order: {member.sortOrder}</p>

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/admin/team-members/${member.id}/edit`}
                  className="flex-1 text-center text-xs px-2 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
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
