'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    photo: '',
    email: '',
    linkedIn: '',
    sortOrder: 0,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.role) { setError('Name and role are required.'); return; }
    setSaving(true);
    setError('');

    const res = await fetch('/api/admin/team-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin/team-members');
    } else {
      setError('Failed to create team member.');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/team-members" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Team Members
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          New Team Member
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
        <FormField label="Name" htmlFor="name" required>
          <input
            id="name"
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Jane Doe"
          />
        </FormField>

        <FormField label="Role / Title" htmlFor="role" required>
          <input
            id="role"
            className={inputClass}
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            placeholder="Editor-in-Chief"
          />
        </FormField>

        <FormField label="Bio" htmlFor="bio">
          <textarea
            id="bio"
            rows={4}
            className={inputClass + ' resize-none'}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="A short bio…"
          />
        </FormField>

        <ImageUpload
          value={form.photo}
          onChange={(url) => setForm((f) => ({ ...f, photo: url }))}
          folder="taari/team"
          label="Photo"
          aspect="aspect-square"
        />

        <FormField label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="jane@taari.com"
          />
        </FormField>

        <FormField label="LinkedIn URL" htmlFor="linkedIn">
          <input
            id="linkedIn"
            type="url"
            className={inputClass}
            value={form.linkedIn}
            onChange={(e) => setForm((f) => ({ ...f, linkedIn: e.target.value }))}
            placeholder="https://linkedin.com/in/janedoe"
          />
        </FormField>

        <FormField label="Sort Order" htmlFor="sortOrder" hint="Lower numbers appear first.">
          <input
            id="sortOrder"
            type="number"
            className={inputClass}
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
          />
        </FormField>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Member'}
          </button>
          <Link
            href="/admin/team-members"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
