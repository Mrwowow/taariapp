'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

export interface BannerFormValues {
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
  badge: string;
  sortOrder: number;
  active: boolean;
}

interface Props {
  mode: 'new' | 'edit';
  initial: BannerFormValues;
  bannerId?: string;
}

export default function BannerForm({ mode, initial, bannerId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<BannerFormValues>(initial);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) { setError('Title is required.'); return; }
    if (!form.image) { setError('Banner image is required.'); return; }
    setSaving(true);
    setError('');

    const url = mode === 'new'
      ? '/api/admin/banners'
      : `/api/admin/banners/${bannerId}`;

    const res = await fetch(url, {
      method: mode === 'new' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin/banners');
    } else {
      setError(`Failed to ${mode === 'new' ? 'create' : 'update'} banner.`);
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/banners" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Banners
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {mode === 'new' ? 'New Banner' : 'Edit Banner'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
        <ImageUpload
          value={form.image}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          folder="taari/banners"
          label="Banner Image"
          aspect="aspect-[21/9]"
        />

        <FormField label="Title" htmlFor="title" required>
          <input
            id="title"
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="The Sound of the New South"
          />
        </FormField>

        <FormField label="Subtitle" htmlFor="subtitle">
          <textarea
            id="subtitle"
            rows={2}
            className={`${inputClass} resize-none`}
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            placeholder="A short description shown below the title…"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Badge" htmlFor="badge" hint="Small label above title (e.g. city, category)">
            <input
              id="badge"
              className={inputClass}
              value={form.badge}
              onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              placeholder="Pittsburgh"
            />
          </FormField>

          <FormField label="Sort Order" htmlFor="sortOrder" hint="Lower numbers show first">
            <input
              id="sortOrder"
              type="number"
              className={inputClass}
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="CTA Label" htmlFor="ctaLabel">
            <input
              id="ctaLabel"
              className={inputClass}
              value={form.ctaLabel}
              onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
              placeholder="Read Story"
            />
          </FormField>

          <FormField label="CTA URL" htmlFor="ctaUrl">
            <input
              id="ctaUrl"
              className={inputClass}
              value={form.ctaUrl}
              onChange={(e) => setForm((f) => ({ ...f, ctaUrl: e.target.value }))}
              placeholder="/stories/my-story"
            />
          </FormField>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="accent-[#1A1A1A]"
          />
          <span className="text-sm font-medium text-gray-700">Active (show in hero slider)</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : mode === 'new' ? 'Create Banner' : 'Save Changes'}
          </button>
          <Link
            href="/admin/banners"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
