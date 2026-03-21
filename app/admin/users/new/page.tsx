'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CITIES = ['Atlanta', 'Houston', 'Toronto', 'London', 'New York', 'Other'];
const ROLES = ['admin', 'editor', 'contributor', 'reader'] as const;

export default function NewUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'contributor' as typeof ROLES[number],
    city: '',
    avatar: '',
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? 'Failed to create user');
        return;
      }
      router.push('/admin/users');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/users" className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A]">
          ← Users
        </Link>
        <span className="text-[#6B6B6B]">/</span>
        <h1 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Playfair Display, serif' }}>
          New User
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
            placeholder="Full name"
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
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-[#C8956C]">*</span></label>
          <select
            required
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A] appearance-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Admin — full access · Editor — manage content · Contributor — submit content · Reader — view only
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A] appearance-none"
          >
            <option value="">Select city (optional)</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
          <input
            type="url"
            value={form.avatar}
            onChange={(e) => set('avatar', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A]"
            placeholder="https://... (leave blank for auto-generated)"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white text-sm font-medium px-6 py-2.5 rounded hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create User'}
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
