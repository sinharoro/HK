'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [useEmail, setUseEmail] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useEmail ? { email, password } : { username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">HUSTISYAKONEK</h1>
          <p className="mt-2 text-sm text-blue-200">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-200">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <button type="button" onClick={() => setUseEmail(true)} className={`cursor-pointer text-sm px-3 py-1 rounded-lg ${useEmail ? 'bg-blue-600 text-white' : 'text-blue-200'}`}>Email</button>
            <button type="button" onClick={() => setUseEmail(false)} className={`cursor-pointer text-sm px-3 py-1 rounded-lg ${!useEmail ? 'bg-blue-600 text-white' : 'text-blue-200'}`}>Username</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200">{useEmail ? 'Email' : 'Username'}</label>
            {useEmail ? (
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                placeholder="Enter your email" required />
            ) : (
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                placeholder="Enter your username" required />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-blue-200">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">
            Register here
          </Link>
        </div>

        <div className="mt-4 rounded-lg bg-white/5 p-4 text-xs text-blue-300">
          <p className="mb-1 font-medium">Demo Accounts (click to fill):</p>
          {[{ label: 'Secretary', user: 'secretary' }, { label: 'Chairman', user: 'chairman' }, { label: 'Complainant', user: 'complainant' }].map((d) => (
            <button key={d.user} type="button" onClick={() => { setUseEmail(false); setUsername(d.user); setPassword('password123'); }}
              className="cursor-pointer block w-full text-left rounded px-1.5 py-0.5 hover:bg-white/10 transition">
              {d.label}: {d.user} / password123
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
