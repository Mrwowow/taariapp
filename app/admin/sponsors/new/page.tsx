'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

export default function NewSponsorPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    url: '',
    logo: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) { setError('Name is required.'); return; }
    setSaving(true);
    setError('');

    const res = await fetch('/api/admin/sponsors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin/sponsors');
    } else {
      setError('Failed to create sponsor.');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/sponsors" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Sponsors
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          New Sponsor
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
            placeholder="Shea Moisture"
          />
        </FormField>

        <FormField label="Tagline" htmlFor="tagline">
          <input
            id="tagline"
            className={inputClass}
            value={form.tagline}
            onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
            placeholder="Beauty rooted in tradition"
          />
        </FormField>

        <FormField label="URL" htmlFor="url">
          <input
            id="url"
            type="url"
            className={inputClass}
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            placeholder="https://example.com"
          />
        </FormField>

        <ImageUpload
          value={form.logo}
          onChange={(url) => setForm((f) => ({ ...f, logo: url }))}
          folder="taari/sponsors"
          label="Logo"
          aspect="aspect-square"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Sponsor'}
          </button>
          <Link
            href="/admin/sponsors"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
