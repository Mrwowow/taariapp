'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';
import { cities } from '@/lib/data';

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

interface QA { question: string; answer: string }

export default function NewInterviewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    name: '',
    slug: '',
    bio: '',
    oneLiner: '',
    citySlug: cities[0].slug,
    portrait: '',
    publishedAt: new Date().toISOString().slice(0, 10),
  });
  const [qas, setQas] = useState<QA[]>([{ question: '', answer: '' }]);

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: slugify(name) }));
  }

  function updateQA(idx: number, field: keyof QA, value: string) {
    setQas((prev) => prev.map((qa, i) => (i === idx ? { ...qa, [field]: value } : qa)));
  }

  function addQA() { setQas((prev) => [...prev, { question: '', answer: '' }]); }

  function removeQA(idx: number) {
    setQas((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug) { setError('Name and slug are required.'); return; }
    setSaving(true);
    setError('');

    const city = cities.find((c) => c.slug === form.citySlug) ?? cities[0];
    const payload = {
      title: form.title || `A Conversation with ${form.name}`,
      slug: form.slug,
      name: form.name,
      bio: form.bio,
      oneLiner: form.oneLiner,
      portrait: form.portrait,
      city,
      questions: qas.filter((qa) => qa.question && qa.answer),
      publishedAt: form.publishedAt,
    };

    const res = await fetch('/api/admin/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin/interviews');
    } else {
      setError('Failed to create interview.');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/interviews" className="text-[#6B6B6B] hover:text-[#1A1A1A] text-sm">
          ← Interviews
        </Link>
        <span className="text-gray-300">/</span>
        <h1
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          New Interview
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
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Kwame Asante"
          />
        </FormField>

        <FormField label="Slug" htmlFor="slug" required hint="Auto-generated from name.">
          <input
            id="slug"
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </FormField>

        <FormField label="Title" htmlFor="title" hint='Defaults to "A Conversation with [Name]"'>
          <input
            id="title"
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="A Conversation with Kwame Asante"
          />
        </FormField>

        <FormField label="One-liner" htmlFor="oneLiner">
          <input
            id="oneLiner"
            className={inputClass}
            value={form.oneLiner}
            onChange={(e) => setForm((f) => ({ ...f, oneLiner: e.target.value }))}
            placeholder="Building bridges through art"
          />
        </FormField>

        <FormField label="Bio" htmlFor="bio">
          <textarea
            id="bio"
            className={`${inputClass} resize-none`}
            rows={2}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
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

        <FormField label="Portrait URL" htmlFor="portrait">
          <input
            id="portrait"
            className={inputClass}
            value={form.portrait}
            onChange={(e) => setForm((f) => ({ ...f, portrait: e.target.value }))}
            placeholder="https://images.unsplash.com/…"
          />
        </FormField>

        {/* Q&A */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Q&amp;A Pairs</label>
            <button
              type="button"
              onClick={addQA}
              className="text-xs border border-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-50 transition-colors"
            >
              + Add Q&amp;A
            </button>
          </div>

          {qas.map((qa, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-3 relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Q&amp;A {idx + 1}
                </span>
                {qas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQA(idx)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                className={inputClass}
                placeholder="Question"
                value={qa.question}
                onChange={(e) => updateQA(idx, 'question', e.target.value)}
              />
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Answer"
                value={qa.answer}
                onChange={(e) => updateQA(idx, 'answer', e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C8956C] transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Interview'}
          </button>
          <Link
            href="/admin/interviews"
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
