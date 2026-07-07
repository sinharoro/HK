'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '', contact: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'complainant' }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 text-center backdrop-blur-lg">
          <div className="mb-4 text-5xl">&#10003;</div>
          <h2 className="mb-2 text-2xl font-bold text-white">Registration Successful!</h2>
          <p className="mb-6 text-blue-200">You can now sign in to your account.</p>
          <Link
            href="/login"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-500"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Register</h1>
          <p className="mt-2 text-sm text-blue-200">Create a complainant account</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-200">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-200">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-blue-400 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200">Username</label>
            <input type="text" name="username" value={form.username} onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-blue-400 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200">Email <span className="text-blue-300/60">(optional)</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-blue-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-blue-400 focus:outline-none" required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200">Contact No.</label>
            <input type="text" name="contact" value={form.contact} onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-blue-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-blue-400 focus:outline-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-blue-200">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
