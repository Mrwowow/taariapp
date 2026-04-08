'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

export default function NewCityPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    slug: '',
    heroImage: '',
    description: '',
  });

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) { setError('Name is required.'); return; }
    if (!form.slug) { setError('Slug is required.'); return; }
    setSaving(true);
    setError('');

    const res = await fetch('/api/admin/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin/cities');
    } else {
      setError('Failed to create city.');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/cities" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Cities
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          New City
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
        <FormField label="City Name" htmlFor="name" required>
          <input
            id="name"
            className={inputClass}
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({ ...f, name, slug: f.slug || autoSlug(name) }));
            }}
            placeholder="Pittsburgh"
          />
        </FormField>

        <FormField label="Slug" htmlFor="slug" required hint="URL-friendly identifier (e.g. pittsburgh)">
          <input
            id="slug"
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="pittsburgh"
          />
        </FormField>

        <FormField label="Description" htmlFor="description">
          <textarea
            id="description"
            rows={4}
            className={inputClass}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="A brief description of this city edition…"
          />
        </FormField>

        <ImageUpload
          value={form.heroImage}
          onChange={(url) => setForm((f) => ({ ...f, heroImage: url }))}
          folder="taari/cities"
          label="Hero Image"
          aspect="aspect-video"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create City'}
          </button>
          <Link
            href="/admin/cities"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
