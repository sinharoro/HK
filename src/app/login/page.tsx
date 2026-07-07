'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const NAVY = '#1E3A5F';
const DARK_NAVY = '#0F172A';
const GOLD = '#D4A843';
const LIGHT_GOLD = '#E8C56A';

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

  function fillDemo(user: string) {
    setUseEmail(false);
    setUsername(user);
    setPassword('password123');
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: `linear-gradient(135deg, ${DARK_NAVY}, ${NAVY}, ${DARK_NAVY})`,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div className="flex flex-col items-center mb-7">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-2xl"
          />
          <h1 className="mt-4 text-[26px] font-bold tracking-wider" style={{ color: GOLD }}>
            HUSTISYAKONEK
          </h1>
          <p className="mt-1 text-xs tracking-wide" style={{ color: `${LIGHT_GOLD}CC` }}>
            Barangay Justice System
          </p>
        </div>

        {error && (
          <div
            className="mb-4 rounded-lg p-3 text-sm"
            style={{
              backgroundColor: 'rgba(255, 0, 0, 0.15)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              color: '#FF6B6B',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUseEmail(true)}
              className="cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium transition"
              style={{
                backgroundColor: useEmail ? GOLD : 'transparent',
                color: useEmail ? DARK_NAVY : LIGHT_GOLD,
                border: `1px solid ${useEmail ? GOLD : `${LIGHT_GOLD}66`}`,
              }}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setUseEmail(false)}
              className="cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium transition"
              style={{
                backgroundColor: !useEmail ? GOLD : 'transparent',
                color: !useEmail ? DARK_NAVY : LIGHT_GOLD,
                border: `1px solid ${!useEmail ? GOLD : `${LIGHT_GOLD}66`}`,
              }}
            >
              Username
            </button>
          </div>

          <div>
            {useEmail ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                }}
                onFocus={(e) => (e.target.style.borderColor = GOLD)}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
              />
            ) : (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your Username"
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                }}
                onFocus={(e) => (e.target.style.borderColor = GOLD)}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
              />
            )}
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
              className="w-full rounded-lg border px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              }}
              onFocus={(e) => (e.target.style.borderColor = GOLD)}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg py-3 text-sm font-semibold transition disabled:opacity-50"
            style={{
              backgroundColor: GOLD,
              color: DARK_NAVY,
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm" style={{ color: `${LIGHT_GOLD}B3` }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium transition" style={{ color: GOLD }}>
            Register here
          </Link>
        </div>

        <div
          className="mt-3 rounded-lg p-3.5 text-xs"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <p className="mb-1 font-semibold" style={{ color: LIGHT_GOLD }}>
            Demo Accounts:
          </p>
          {[
            { label: 'Secretary', user: 'secretary' },
            { label: 'Chairman', user: 'chairman' },
            { label: 'Complainant', user: 'complainant' },
          ].map((d) => (
            <button
              key={d.user}
              type="button"
              onClick={() => fillDemo(d.user)}
              className="cursor-pointer block w-full rounded px-1.5 py-0.5 text-left transition hover:bg-white/10"
              style={{ color: `${LIGHT_GOLD}99` }}
            >
              {d.label}: {d.user} / password123
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
