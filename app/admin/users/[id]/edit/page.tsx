'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';
import type { User } from '@/lib/store';

const CITIES = ['Atlanta', 'Houston', 'Toronto', 'London', 'New York', 'Other'];
const ROLES = ['admin', 'editor', 'contributor', 'reader'] as const;

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'contributor',
    city: '',
    avatar: '',
    status: 'active',
  });

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then((user: User) => {
        setForm({
          name: user.name,
          email: user.email,
          password: '',
          role: user.role,
          city: user.city ?? '',
          avatar: user.avatar ?? '',
          status: user.status,
        });
        setLoading(false);
      });
  }, [id]);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? 'Failed to update user');
        return;
      }
      router.push('/admin/users');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-12 text-sm text-[#6B6B6B]">Loading...</div>;

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/users" className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A]">
          ← Users
        </Link>
        <span className="text-[#6B6B6B]">/</span>
        <h1 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Edit User
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-[#C8956C]">*</span></label>
          <input
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-[#C8956C]">*</span></label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            minLength={6}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A]"
            placeholder="Leave blank to keep current password"
          />
          <p className="text-xs text-[#6B6B6B] mt-1">Only fill this if you want to change the password.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A] appearance-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A] appearance-none"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A] appearance-none"
          >
            <option value="">Select city</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <ImageUpload
          value={form.avatar}
          onChange={(url) => set('avatar', url)}
          folder="taari/avatars"
          label="Profile Picture"
          aspect="aspect-square"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white text-sm font-medium px-6 py-2.5 rounded hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/users"
            className="border border-gray-200 text-gray-600 text-sm font-medium px-6 py-2.5 rounded hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
