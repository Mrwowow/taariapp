'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

export default function EditPartnershipPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    logo: '',
    description: '',
    url: '',
    type: 'partner',
    sortOrder: 0,
    active: true,
  });

  useEffect(() => {
    fetch(`/api/admin/partnerships/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setForm({
          name: p.name ?? '',
          logo: p.logo ?? '',
          description: p.description ?? '',
          url: p.url ?? '',
          type: p.type ?? 'partner',
          sortOrder: p.sortOrder ?? 0,
          active: p.active ?? true,
        });
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) { setError('Name is required.'); return; }
    setSaving(true);
    setError('');

    const res = await fetch(`/api/admin/partnerships/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin/partnerships');
    } else {
      setError('Failed to update partnership.');
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/partnerships" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Partnerships
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Edit Partnership
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
          />
        </FormField>

        <FormField label="Type" htmlFor="type">
          <select
            id="type"
            className={inputClass}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="partner">Partner</option>
            <option value="media">Media Partner</option>
            <option value="community">Community Partner</option>
            <option value="institutional">Institutional Partner</option>
            <option value="brand">Brand Partner</option>
          </select>
        </FormField>

        <FormField label="Description" htmlFor="description">
          <textarea
            id="description"
            rows={3}
            className={inputClass + ' resize-none'}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </FormField>

        <FormField label="URL" htmlFor="url">
          <input
            id="url"
            type="url"
            className={inputClass}
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          />
        </FormField>

        <ImageUpload
          value={form.logo}
          onChange={(url) => setForm((f) => ({ ...f, logo: url }))}
          folder="taari/partnerships"
          label="Logo"
          aspect="aspect-square"
        />

        <FormField label="Sort Order" htmlFor="sortOrder" hint="Lower numbers appear first.">
          <input
            id="sortOrder"
            type="number"
            className={inputClass}
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
          />
        </FormField>

        <FormField label="Status" htmlFor="active">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-[#1A1A1A]">Active (visible on public page)</span>
          </label>
        </FormField>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link
            href="/admin/partnerships"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
