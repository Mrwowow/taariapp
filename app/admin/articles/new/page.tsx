'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import { cities } from '@/lib/data';

const CATEGORIES = ['Culture', 'Music', 'Art', 'Food', 'Community', 'Fashion', 'Tech'];

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    citySlug: cities[0].slug,
    categories: [] as string[],
    isSponsored: false,
    authorName: '',
    readTime: '5',
    featuredImage: '',
    publishedAt: new Date().toISOString().slice(0, 10),
  });

  function handleTitleChange(title: string) {
    setForm((f) => ({ ...f, title, slug: slugify(title) }));
  }

  function toggleCategory(cat: string) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.slug) { setError('Title and slug are required.'); return; }
    setSaving(true);
    setError('');

    const city = cities.find((c) => c.slug === form.citySlug) ?? cities[0];
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      body: form.body.split('\n').filter(Boolean),
      gallery: [],
      city,
      categories: form.categories,
      isSponsored: form.isSponsored,
      author: {
        name: form.authorName || 'TAARi Staff',
        slug: slugify(form.authorName || 'taari-staff'),
        avatar: '',
        bio: '',
        socialLinks: [],
      },
      readTime: parseInt(form.readTime) || 5,
      featuredImage: form.featuredImage,
      publishedAt: form.publishedAt,
    };

    const res = await fetch('/api/admin/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin/articles');
    } else {
      setError('Failed to create article.');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/articles" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Articles
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          New Article
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
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="The Sound of the New South"
          />
        </FormField>

        <FormField label="Slug" htmlFor="slug" required hint="Auto-generated from title. Edit if needed.">
          <input
            id="slug"
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="the-sound-of-the-new-south"
          />
        </FormField>

        <FormField label="Excerpt" htmlFor="excerpt">
          <textarea
            id="excerpt"
            className={`${inputClass} resize-none`}
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            placeholder="A short description of the article…"
          />
        </FormField>

        <FormField label="Body" htmlFor="body" hint="One paragraph per line. Each line becomes a separate paragraph.">
          <textarea
            id="body"
            className={`${inputClass} resize-y font-mono text-xs`}
            rows={8}
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="First paragraph...&#10;Second paragraph..."
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

          <FormField label="Read Time (min)" htmlFor="readTime">
            <input
              id="readTime"
              type="number"
              min={1}
              className={inputClass}
              value={form.readTime}
              onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
            />
          </FormField>
        </div>

        <FormField label="Categories">
          <div className="flex flex-wrap gap-2 mt-1">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="accent-[#1A1A1A]"
                />
                <span className="text-sm text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Featured Image URL" htmlFor="featuredImage">
          <input
            id="featuredImage"
            className={inputClass}
            value={form.featuredImage}
            onChange={(e) => setForm((f) => ({ ...f, featuredImage: e.target.value }))}
            placeholder="https://images.unsplash.com/…"
          />
        </FormField>

        <FormField label="Author Name" htmlFor="authorName">
          <input
            id="authorName"
            className={inputClass}
            value={form.authorName}
            onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
            placeholder="Amara Okafor"
          />
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

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isSponsored}
            onChange={(e) => setForm((f) => ({ ...f, isSponsored: e.target.checked }))}
            className="accent-[#C8956C]"
          />
          <span className="text-sm font-medium text-gray-700">Sponsored content</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Article'}
          </button>
          <Link
            href="/admin/articles"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
