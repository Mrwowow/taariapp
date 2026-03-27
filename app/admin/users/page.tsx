'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@/lib/store';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  editor: 'bg-blue-100 text-blue-700',
  contributor: 'bg-[#FDF3EA] text-[#C8956C]',
  reader: 'bg-gray-100 text-gray-600',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-600',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  async function load() {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  async function toggleStatus(user: User) {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const updated = await res.json();
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Users
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">{users.length} total users</p>
        </div>
        <Link
          href="/admin/users/new"
          className="bg-[#1A1A1A] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[#C8956C] transition-colors"
        >
          + New User
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:border-[#1A1A1A]"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A]"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="contributor">Contributor</option>
          <option value="reader">Reader</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#6B6B6B] text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[#6B6B6B] text-sm">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-[#6B6B6B]">User</th>
                <th className="text-left px-4 py-3 font-medium text-[#6B6B6B]">Role</th>
                <th className="text-left px-4 py-3 font-medium text-[#6B6B6B] hidden md:table-cell">City</th>
                <th className="text-left px-4 py-3 font-medium text-[#6B6B6B] hidden lg:table-cell">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-[#6B6B6B]">Status</th>
                <th className="text-right px-4 py-3 font-medium text-[#6B6B6B]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{user.name}</p>
                        <p className="text-xs text-[#6B6B6B]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B6B6B] hidden md:table-cell">{user.city || '—'}</td>
                  <td className="px-4 py-3 text-[#6B6B6B] hidden lg:table-cell">
                    {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => toggleStatus(user)}
                        className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                          user.status === 'active'
                            ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
                            : 'border-green-200 text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="text-xs border border-red-200 text-red-600 px-2.5 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
