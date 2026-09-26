'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

const PLATFORMS = ['Instagram', 'X', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube', 'Website'];

export interface AuthorFormValues {
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  socialLinks: { platform: string; url: string }[];
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function AuthorForm({ authorId, initial }: { authorId?: string; initial?: AuthorFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(authorId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<AuthorFormValues>(
    initial ?? { name: '', slug: '', avatar: '', bio: '', socialLinks: [] },
  );

  function updateLink(i: number, patch: Partial<{ platform: string; url: string }>) {
    setForm((f) => ({ ...f, socialLinks: f.socialLinks.map((l, j) => (j === i ? { ...l, ...patch } : l)) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = slugify(form.slug);
    if (!form.name.trim() || !slug) { setError('Name and slug are required.'); return; }
    setSaving(true);
    setError('');

    const res = await fetch(isEdit ? `/api/admin/authors/${authorId}` : '/api/admin/authors', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, name: form.name.trim(), slug }),
    });

    if (res.ok) {
      router.push('/admin/authors');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || `Failed to ${isEdit ? 'update' : 'create'} author.`);
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/authors" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Authors
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {isEdit ? 'Edit Author' : 'New Author'}
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
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({ ...f, name, slug: isEdit ? f.slug : slugify(name) }));
            }}
            placeholder="Jane Doe"
          />
        </FormField>

        <FormField label="Slug" htmlFor="slug" required hint="URL-friendly identifier (e.g. jane-doe)">
          <input
            id="slug"
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </FormField>

        <FormField label="Bio" htmlFor="bio">
          <textarea
            id="bio"
            rows={4}
            className={inputClass}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="A short bio shown on the author's articles…"
          />
        </FormField>

        <ImageUpload
          value={form.avatar}
          onChange={(url) => setForm((f) => ({ ...f, avatar: url }))}
          folder="taari/authors"
          label="Photo"
          aspect="aspect-square"
        />

        <FormField label="Social Links" htmlFor="social-0">
          <div className="space-y-2">
            {form.socialLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <select
                  id={`social-${i}`}
                  className={`${inputClass} w-36 shrink-0`}
                  value={link.platform}
                  onChange={(e) => updateLink(i, { platform: e.target.value })}
                >
                  {(PLATFORMS.includes(link.platform) ? PLATFORMS : [link.platform, ...PLATFORMS]).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <input
                  className={inputClass}
                  value={link.url}
                  onChange={(e) => updateLink(i, { url: e.target.value })}
                  placeholder="https://…"
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, socialLinks: f.socialLinks.filter((_, j) => j !== i) }))}
                  className="text-xs px-3 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, socialLinks: [...f.socialLinks, { platform: PLATFORMS[0], url: '' }] }))}
              className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
            >
              + Add link
            </button>
          </div>
        </FormField>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Author'}
          </button>
          <Link
            href="/admin/authors"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
