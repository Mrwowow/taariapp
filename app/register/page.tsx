'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const cityOptions = ['Atlanta', 'Houston', 'Toronto', 'London', 'New York'];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          city: form.city,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      router.push('/login?registered=1');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-4xl font-bold text-cream tracking-tight">
            TAARi
          </Link>
          <p className="text-muted text-sm mt-2">Join the Diaspora community</p>
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red/10 border border-red/20 rounded-lg px-4 py-3 text-sm text-red">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-cream/80 mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-muted outline-none focus:border-accent transition-colors"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cream/80 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-muted outline-none focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-cream/80 mb-1.5">
                City
              </label>
              <select
                id="city"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-cream outline-none focus:border-accent transition-colors appearance-none"
              >
                <option value="" className="bg-dark text-muted">Select your city</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c} className="bg-dark text-cream">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cream/80 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-muted outline-none focus:border-accent transition-colors"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-cream/80 mb-1.5">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-muted outline-none focus:border-accent transition-colors"
                placeholder="Repeat your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-dark text-sm font-bold uppercase tracking-wider py-3.5 rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-muted">or sign up with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 border border-white/10 rounded-lg py-3 text-sm text-cream/70 hover:bg-white/5 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-white/10 rounded-lg py-3 text-sm text-cream/70 hover:bg-white/5 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted text-center mt-6 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="#" className="text-accent hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" className="text-accent hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:text-accent-dark transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
