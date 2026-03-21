"use client";

import { useState } from "react";

interface NewsletterFormProps {
  variant?: "light" | "dark";
}

export default function NewsletterForm({ variant = "light" }: NewsletterFormProps) {
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
      <p className={`text-sm ${variant === "dark" ? "text-accent" : "text-accent"}`}>
        Welcome to TAARi. Check your inbox.
      </p>
    );
  }

  const inputBorder = variant === "dark" ? "border-cream/30 text-cream placeholder:text-cream/40" : "border-border text-dark placeholder:text-muted";
  const btnBg = variant === "dark" ? "bg-accent text-dark hover:bg-accent-dark" : "bg-dark text-cream hover:bg-accent";

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className={`flex-1 h-12 px-4 bg-transparent border ${inputBorder} text-sm focus:outline-none focus:border-accent transition-colors`}
      />
      <button
        type="submit"
        className={`h-12 px-6 text-xs font-medium uppercase tracking-[0.1em] ${btnBg} transition-colors shrink-0`}
      >
        Subscribe
      </button>
    </form>
  );
}
