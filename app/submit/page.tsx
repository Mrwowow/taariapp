"use client";

import { useState } from "react";
import Link from "next/link";

const CITIES = ["Atlanta", "Houston", "Toronto", "London", "New York", "Other"];

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
    <div className="py-16 px-6">
      <div className="mx-auto max-w-[640px]">
        {/* Header */}
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark mb-3">
          Submit Your Story
        </h1>
        <p className="text-lg text-muted mb-10">
          Have a story from the Diaspora? We want to hear it.
        </p>
        <div className="w-full h-[1px] bg-border mb-10" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Full Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full h-12 px-4 border border-border bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors"
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
              className="w-full h-12 px-4 border border-border bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              City <span className="text-accent">*</span>
            </label>
            <select
              required
              className="w-full h-12 px-4 border border-border bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors appearance-none"
              defaultValue=""
            >
              <option value="" disabled>
                Select a city
              </option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Story */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Your Story <span className="text-accent">*</span>
            </label>
            <textarea
              required
              maxLength={500}
              rows={6}
              onChange={(e) => setCharCount(e.target.value.length)}
              className="w-full px-4 py-3 border border-border bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors resize-none"
              placeholder="Tell us your story in a few words..."
            />
            <p className="text-xs text-muted mt-1">{charCount} / 500 characters</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Upload Images <span className="text-muted font-normal">(optional)</span>
            </label>
            <div className="border-2 border-dashed border-border p-8 text-center hover:border-muted transition-colors cursor-pointer">
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
              <p className="text-sm text-muted">Drag & drop or click to upload</p>
              <p className="text-xs text-muted mt-1">Max 5 images, 10MB each &middot; JPG, PNG, WebP</p>
            </div>
          </div>

          {/* Video Link */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Video Link <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              type="url"
              className="w-full h-12 px-4 border border-border bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors"
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
              className="w-full h-12 px-4 border border-border bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors"
              placeholder="@yourhandle"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-14 bg-dark text-cream text-xs font-medium uppercase tracking-[0.1em] hover:bg-accent transition-colors"
          >
            Submit Story
          </button>
        </form>
      </div>
    </div>
  );
}
