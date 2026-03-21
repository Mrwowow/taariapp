'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import { cities } from '@/lib/data';

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

export default function NewReelPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    caption: '',
    thumbnail: '',
    citySlug: cities[0].slug,
    publishedAt: new Date().toISOString().slice(0, 10),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) { setError('Title is required.'); return; }
    setSaving(true);
    setError('');

    const city = cities.find((c) => c.slug === form.citySlug) ?? cities[0];
    const payload = {
      id: Date.now().toString(),
      title: form.title,
      caption: form.caption,
      thumbnail: form.thumbnail,
      city,
      publishedAt: form.publishedAt,
    };

    const res = await fetch('/api/admin/reels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin/reels');
    } else {
      setError('Failed to create reel.');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/reels" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Reels
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          New Reel
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
        <FormField label="Title" htmlFor="title" required>
          <input
            id="title"
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Street Sounds"
          />
        </FormField>

        <FormField label="Caption" htmlFor="caption">
          <textarea
            id="caption"
            className={`${inputClass} resize-none`}
            rows={2}
            value={form.caption}
            onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
            placeholder="The rhythm of Auburn Avenue at golden hour"
          />
        </FormField>

        <FormField label="Thumbnail URL" htmlFor="thumbnail">
          <input
            id="thumbnail"
            className={inputClass}
            value={form.thumbnail}
            onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
            placeholder="https://images.unsplash.com/…"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="City" htmlFor="city">
            <select
              id="city"
              className={inputClass}
              value={form.citySlug}
              onChange={(e) => setForm((f) => ({ ...f, citySlug: e.target.value }))}
            >
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Published At" htmlFor="publishedAt">
            <input
              id="publishedAt"
              type="date"
              className={inputClass}
              value={form.publishedAt}
              onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
            />
          </FormField>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Reel'}
          </button>
          <Link
            href="/admin/reels"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
