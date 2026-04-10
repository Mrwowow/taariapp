"use client";

import { useState } from "react";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";

export default function LaunchPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // silently fail — non-critical
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center space-y-12">
        {/* Logo / Brand */}
        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 border border-accent/30 rounded-full">
            <span className="text-accent text-xs sm:text-sm uppercase tracking-[0.25em] font-medium">
              Coming Soon
            </span>
          </div>

          <h1 className="flex justify-center">
            <Image
              src="/images/taarilogo.png"
              alt="TAARi"
              width={320}
              height={120}
              priority
              className="w-48 sm:w-60 md:w-72 lg:w-80 h-auto"
            />
          </h1>

          <p className="text-muted text-base sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            Documenting the African Diaspora across global cities through editorial photo essays, video reels, and cultural interviews.
          </p>
        </div>

        {/* Countdown */}
        <div className="space-y-4">
          <p className="text-cream/60 text-sm uppercase tracking-[0.15em]">
            Launching April 18, 2026 &middot; 7:30 PM ET
          </p>
          <CountdownTimer />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-border" />
          <span className="text-accent text-xs tracking-widest">&#9670;</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Notify Form */}
        <div className="space-y-4">
          <p className="text-cream text-sm sm:text-base">
            Be the first to know when we go live.
          </p>

          {submitted ? (
            <p className="text-accent font-medium text-sm sm:text-base">
              You&apos;re on the list. We&apos;ll be in touch!
            </p>
          ) : (
            <form
              onSubmit={handleNotify}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-dark-card border border-border text-cream placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-accent hover:bg-accent-dark text-dark font-semibold rounded-lg transition-colors text-sm disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? "..." : "Notify Me"}
              </button>
            </form>
          )}
        </div>

        {/* Footer line */}
        <p className="text-muted/50 text-xs">
          Pittsburgh &middot; Lagos &middot; London &middot; Accra &middot; Toronto
        </p>
      </div>
    </div>
  );
}
