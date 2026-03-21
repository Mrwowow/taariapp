"use client";

import { useState } from "react";

interface NewsletterFormProps {
  variant?: "light" | "dark";
}

export default function NewsletterForm({ variant: _variant = "dark" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStatus("success");
      setEmail("");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm text-accent">
        Welcome to TAARi. Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 h-12 px-4 bg-transparent border border-white/20 text-cream placeholder:text-muted text-sm focus:outline-none focus:border-accent transition-colors"
      />
      <button
        type="submit"
        className="h-12 px-6 text-[11px] font-bold uppercase tracking-[0.15em] bg-accent text-dark hover:bg-accent-dark transition-colors shrink-0"
      >
        Subscribe
      </button>
    </form>
  );
}
