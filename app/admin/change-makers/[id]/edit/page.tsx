'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

const categories = [
  'Community Leadership',
  'Arts & Culture',
  'Business & Entrepreneurship',
  'Education',
  'Health & Wellness',
  'Social Justice',
  'Technology & Innovation',
  'Youth Development',
  'Faith & Spirituality',
  'Other',
];

export default function EditChangeMakerPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    title: '',
    bio: '',
    photo: '',
    category: '',
    city: '',
    year: new Date().getFullYear(),
    featured: false,
    videoUrl: '',
    publishedAt: '',
  });

  useEffect(() => {
    fetch(`/api/admin/change-makers/${id}`)
      .then((r) => r.json())
      .then((m) => {
        setForm({
          name: m.name ?? '',
          title: m.title ?? '',
          bio: m.bio ?? '',
          photo: m.photo ?? '',
          category: m.category ?? '',
          city: m.city ?? '',
          year: m.year ?? new Date().getFullYear(),
          featured: !!m.featured,
          videoUrl: m.videoUrl ?? '',
          publishedAt: m.publishedAt ? m.publishedAt.slice(0, 10) : '',
        });
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/admin/change-makers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin/change-makers');
    } else {
      setError('Failed to update change maker.');
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/change-makers" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Change Makers
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Edit Change Maker
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
        <FormField label="Full Name" htmlFor="name" required>
          <input
            id="name"
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </FormField>

        <FormField label="Title / Role" htmlFor="title" required>
          <input
            id="title"
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </FormField>

        <FormField label="Bio" htmlFor="bio">
          <textarea
            id="bio"
            rows={5}
            className={inputClass}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          />
        </FormField>

        <ImageUpload
          value={form.photo}
          onChange={(url) => setForm((f) => ({ ...f, photo: url }))}
          folder="taari/change-makers"
          label="Photo"
          aspect="aspect-square"
        />

        <FormField label="Category" htmlFor="category">
          <select
            id="category"
            className={inputClass}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="City" htmlFor="city">
            <input
              id="city"
              className={inputClass}
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </FormField>

          <FormField label="Year" htmlFor="year">
            <input
              id="year"
              type="number"
              className={inputClass}
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
            />
          </FormField>
        </div>

        <FormField label="Publish Date" htmlFor="publishedAt">
          <input
            id="publishedAt"
            type="date"
            className={inputClass}
            value={form.publishedAt}
            onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
          />
        </FormField>

        <FormField label="YouTube Interview Video (optional)" htmlFor="videoUrl">
          <input
            id="videoUrl"
            type="url"
            className={inputClass}
            value={form.videoUrl}
            onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </FormField>

        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <label htmlFor="featured" className="text-sm text-gray-700">Featured Change Maker</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link
            href="/admin/change-makers"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
