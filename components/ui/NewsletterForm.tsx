"use client";

import { useState } from "react";

interface NewsletterFormProps {
  variant?: "light" | "dark" | "footer";
}

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm({ variant = "dark" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const isLight = variant === "light";
  const isFooter = variant === "footer";
  const inputClass = isLight
    ? "flex-1 h-12 px-4 bg-transparent border border-border text-dark placeholder:text-muted text-sm focus:outline-none focus:border-dark transition-colors"
    : isFooter
    ? "flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 px-3 py-2 outline-none min-w-0"
    : "flex-1 h-12 px-4 bg-transparent border border-white/20 text-cream placeholder:text-muted text-sm focus:outline-none focus:border-accent transition-colors";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message === "Already subscribed" ? "You're already subscribed." : "Welcome to TAARi. Check your inbox.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <p className={`text-sm ${isLight ? "text-dark" : isFooter ? "text-gray-300" : "text-accent"}`}>
        {message}
      </p>
    );
  }

  if (isFooter) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-white/20 rounded-lg overflow-hidden flex-1 max-w-[200px]">
            <div className="flex items-center gap-1.5 px-3 py-2 border-r border-white/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3,5 12,13 21,5" />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              disabled={status === "loading"}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-btn-bg text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-btn-bg-hover transition-colors disabled:opacity-60 shrink-0"
          >
            {status === "loading" ? "…" : "Subscribe"}
          </button>
        </div>
        {status === "error" && (
          <p className="text-xs text-red-400">{message}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === "loading"}
          className={`${inputClass} w-full sm:w-auto`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-12 px-6 text-[11px] font-bold uppercase tracking-[0.15em] bg-accent text-dark hover:bg-accent-dark transition-colors shrink-0 disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400 text-left">{message}</p>
      )}
    </form>
  );
}
