"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("All fields are required.");
      return;
    }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <>
        <section className="bg-cream min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md text-center px-4">
            <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-6">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-green"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold text-dark mb-3">
              Message Sent
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for reaching out. We will get back to you as soon as
              possible.
            </p>
            <Link
              href="/home"
              className="inline-block bg-dark text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-accent transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/90 to-dark" />
        <div className="relative mx-auto max-w-[1320px] px-4 md:px-6 py-20 md:py-28 text-center">
          <p className="text-accent font-serif text-sm tracking-[0.25em] uppercase mb-4">
            Get in Touch
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Have a question, story idea, or partnership inquiry? We would love to
            hear from you.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1320px] px-4 md:px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-dark mb-1.5"
                    >
                      Name <span className="text-red">*</span>
                    </label>
                    <input
                      id="name"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-dark focus:ring-1 focus:ring-dark bg-white"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-dark mb-1.5"
                    >
                      Email <span className="text-red">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-dark focus:ring-1 focus:ring-dark bg-white"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-dark mb-1.5"
                  >
                    Subject <span className="text-red">*</span>
                  </label>
                  <select
                    id="subject"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-dark focus:ring-1 focus:ring-dark bg-white"
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                  >
                    <option value="">Select a topic</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Story Submission">Story Submission</option>
                    <option value="Advertising">Advertising</option>
                    <option value="Partnerships">Partnerships</option>
                    <option value="Press & Media">Press & Media</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-dark mb-1.5"
                  >
                    Message <span className="text-red">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-dark focus:ring-1 focus:ring-dark bg-white resize-none"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-dark text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-dark text-lg mb-4">
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-accent shrink-0 mt-0.5"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 4L12 13L2 4" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-dark">Email</p>
                      <p className="text-sm text-gray-600">hello@taari.com</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-accent shrink-0 mt-0.5"
                    >
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M6.5 2h11A4.5 4.5 0 0 1 22 6.5v11a4.5 4.5 0 0 1-4.5 4.5h-11A4.5 4.5 0 0 1 2 17.5v-11A4.5 4.5 0 0 1 6.5 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-dark">Instagram</p>
                      <p className="text-sm text-gray-600">@taarimagazine</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-accent shrink-0 mt-0.5"
                    >
                      <path d="M22.46 6c-.85.38-1.78.64-2.73.76 1-.6 1.76-1.54 2.12-2.67-.93.55-1.96.95-3.06 1.17A4.92 4.92 0 0 0 12 9.5c0 .39.04.77.13 1.13A13.98 13.98 0 0 1 2 5.13a4.92 4.92 0 0 0 1.52 6.57c-.78-.02-1.52-.24-2.16-.6v.06a4.93 4.93 0 0 0 3.95 4.83 4.9 4.9 0 0 1-2.22.08 4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 21.54a13.94 13.94 0 0 0 7.55 2.21" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-dark">
                        Twitter / X
                      </p>
                      <p className="text-sm text-gray-600">@taarimagazine</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-dark text-lg mb-3">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/advertise"
                    className="block text-sm text-accent hover:text-dark transition-colors"
                  >
                    Advertise With Us
                  </Link>
                  <Link
                    href="/partnerships"
                    className="block text-sm text-accent hover:text-dark transition-colors"
                  >
                    Partnership Opportunities
                  </Link>
                  <Link
                    href="/submit"
                    className="block text-sm text-accent hover:text-dark transition-colors"
                  >
                    Submit Your Story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
