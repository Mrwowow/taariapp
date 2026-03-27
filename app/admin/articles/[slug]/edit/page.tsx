'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import type { Article, City } from '@/lib/store';

const CATEGORIES = ['Culture', 'Music', 'Art', 'Food', 'Community', 'Fashion', 'Tech'];

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

export default function EditArticlePage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cities, setCities] = useState<City[]>([]);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    citySlug: '',
    categories: [] as string[],
    isSponsored: false,
    authorName: '',
    readTime: '5',
    featuredImage: '',
    publishedAt: '',
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/articles/${slug}`).then((r) => r.json()),
      fetch('/api/admin/cities').then((r) => r.json()),
    ]).then(([a, citiesData]: [Article, City[]]) => {
      setCities(citiesData);
      setForm({
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        body: a.body.join('\n'),
        citySlug: a.city.slug,
        categories: a.categories,
        isSponsored: a.isSponsored,
        authorName: a.author.name,
        readTime: String(a.readTime),
        featuredImage: a.featuredImage,
        publishedAt: a.publishedAt,
      });
      setLoading(false);
    });
  }, [slug]);

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
    setSaving(true);
    setError('');

    const city = cities.find((c) => c.slug === form.citySlug) ?? cities[0];
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      body: form.body.split('\n').filter(Boolean),
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

    const res = await fetch(`/api/admin/articles/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin/articles');
    } else {
      setError('Failed to update article.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
    );
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
          Edit Article
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
          />
        </FormField>

        <FormField label="Slug" htmlFor="slug" required hint="Changing slug may break existing links.">
          <input
            id="slug"
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </FormField>

        <FormField label="Excerpt" htmlFor="excerpt">
          <textarea
            id="excerpt"
            className={`${inputClass} resize-none`}
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          />
        </FormField>

        <FormField label="Body" htmlFor="body" hint="One paragraph per line.">
          <textarea
            id="body"
            className={`${inputClass} resize-y font-mono text-xs`}
            rows={8}
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
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

        <ImageUpload
          value={form.featuredImage}
          onChange={(url) => setForm((f) => ({ ...f, featuredImage: url }))}
          folder="taari/articles"
          label="Featured Image"
          aspect="aspect-video"
        />

        <FormField label="Author Name" htmlFor="authorName">
          <input
            id="authorName"
            className={inputClass}
            value={form.authorName}
            onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
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
            {saving ? 'Saving…' : 'Save Changes'}
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
