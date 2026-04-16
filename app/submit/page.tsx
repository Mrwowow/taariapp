"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import LocationSelect from "@/components/ui/LocationSelect";
import RichTextEditor from "@/components/ui/RichTextEditor";

const MAX_IMAGES = 5;

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: '',
    state: '',
    city: '',
    summary: '',
    videoLink: '',
    socialHandles: '',
  });

  async function uploadFiles(files: FileList | File[]) {
    const remaining = MAX_IMAGES - imageUrls.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) {
          setError(`${file.name} exceeds 10MB limit.`);
          continue;
        }
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'taari/submissions');
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          uploaded.push(data.url);
        }
      }
      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch {
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) uploadFiles(e.target.files);
    // reset so same file can be re-selected if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  }

  function removeImage(idx: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rich editor stores HTML; validate that there's real text content.
    const plainText = form.summary.replace(/<[^>]*>/g, '').trim();
    if (!plainText) {
      setError('Please write your story before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrls }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-32 px-6 text-center">
        <div className="mx-auto max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/15 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8956C" strokeWidth="2">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-dark mb-4">
            Thank You for Sharing Your Story
          </h1>
          <p className="text-muted text-lg mb-8">
            We&apos;ll review your submission and get back to you soon.
          </p>
          <Link
            href="/"
            className="inline-block text-xs font-medium uppercase tracking-[0.1em] text-cream bg-dark px-8 py-4 hover:bg-accent transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6 bg-[#F5F3EF] min-h-screen">
      <div className="mx-auto max-w-[640px]">
        {/* Header */}
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark mb-3">
          Submit Your Story
        </h1>
        <p className="text-lg text-muted mb-10">
          Have a story from the Diaspora? We want to hear it.
        </p>

        {/* Form */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm mb-6 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-border/40">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Full Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full h-12 px-5 border border-[#D4D4D0] rounded-[30px] bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Email Address <span className="text-accent">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full h-12 px-5 border border-[#D4D4D0] rounded-[30px] bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* Location */}
          <LocationSelect
            variant="light"
            required
            country={form.country}
            state={form.state}
            city={form.city}
            onChange={(v) => setForm((f) => ({ ...f, ...v }))}
          />

          {/* Story */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Your Story <span className="text-accent">*</span>
            </label>
            <RichTextEditor
              value={form.summary}
              onChange={(html) => setForm((f) => ({ ...f, summary: html }))}
              placeholder="Tell us your story in full — use the toolbar to add headings, quotes, lists, and links."
              minHeight="280px"
            />
            <p className="text-xs text-muted mt-2">
              Format your story with headings, bold, italics, quotes, and lists. No word limit.
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Upload Images <span className="text-muted font-normal">(optional)</span>
            </label>

            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 border border-border overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      aria-label="Remove image"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed border-[#D4D4D0] rounded-[30px] p-8 text-center hover:border-muted transition-colors ${
                uploading || imageUrls.length >= MAX_IMAGES ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
              }`}
            >
              {uploading ? (
                <p className="text-sm text-muted">Uploading…</p>
              ) : imageUrls.length >= MAX_IMAGES ? (
                <p className="text-sm text-muted">Maximum {MAX_IMAGES} images reached</p>
              ) : (
                <>
                  <div className="flex justify-center gap-4 mb-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-14 h-14 border border-border flex items-center justify-center text-muted text-2xl"
                      >
                        +
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted">Drag &amp; drop or click to upload</p>
                  <p className="text-xs text-muted mt-1">
                    Max {MAX_IMAGES} images, 10MB each &middot; JPG, PNG, WebP
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Video Link */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Video Link <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={form.videoLink}
              onChange={(e) => setForm((f) => ({ ...f, videoLink: e.target.value }))}
              className="w-full h-12 px-5 border border-[#D4D4D0] rounded-[30px] bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors"
              placeholder="https://"
            />
            <p className="text-xs text-muted mt-1">YouTube, Vimeo, or Instagram URL</p>
          </div>

          {/* Social Handles */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Social Media Handles <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.socialHandles}
              onChange={(e) => setForm((f) => ({ ...f, socialHandles: e.target.value }))}
              className="w-full h-12 px-5 border border-[#D4D4D0] rounded-[30px] bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors"
              placeholder="@yourhandle"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-14 rounded-[30px] bg-dark text-cream text-xs font-medium uppercase tracking-[0.1em] hover:bg-accent transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit Story'}
          </button>
        </form>
      </div>
    </div>
  );
}
