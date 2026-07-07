'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Stats {
  totalCases: number;
  activeCases: number;
  settledCases: number;
  escalatedCases: number;
  pendingHearings: number;
  totalComplainants: number;
}

interface Case {
  id: number;
  case_number: string;
  title: string;
  status: string;
  respondent_name: string;
  complainant_name: string;
  filing_date: string;
}

const statusColors: Record<string, string> = {
  filed: 'bg-yellow-100 text-yellow-800',
  under_mediation: 'bg-blue-100 text-blue-800',
  settled: 'bg-green-100 text-green-800',
  escalated: 'bg-red-100 text-red-800',
  closed: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  filed: 'Filed',
  under_mediation: 'Under Mediation',
  settled: 'Settled',
  escalated: 'Escalated',
  closed: 'Closed',
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else router.push('/login');
      });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => setStats(data));
    fetch('/api/cases')
      .then((r) => r.json())
      .then((data) => setCases(data.cases || []));
  }, [user]);

  if (!user || !stats) {
    return <div className="text-slate-500">Loading dashboard...</div>;
  }

  const roleLabels: Record<string, string> = {
    secretary: 'Barangay Secretary',
    lupon_chairman: 'Lupon Chairman',
    lupon_member: 'Lupon Member',
    complainant: 'Complainant',
    respondent: 'Respondent',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome, {user.name}
        </h1>
        <p className="text-slate-500">{roleLabels[user.role] || user.role}</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Cases</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{stats.totalCases}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Active Cases</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{stats.activeCases}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Settled</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{stats.settledCases}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Pending Hearings</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{stats.pendingHearings}</p>
        </div>
      </div>

      {/* Cases List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Cases</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Case No.</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Complainant</th>
                <th className="px-6 py-3 font-medium">Respondent</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Filed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No cases found
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr
                    key={c.id}
                    className="cursor-pointer transition hover:bg-slate-50"
                    onClick={() => {
                      const rolePaths: Record<string, string> = {
                        secretary: `/dashboard/secretary/cases/${c.id}`,
                        lupon_chairman: `/dashboard/lupon/cases/${c.id}`,
                        lupon_member: `/dashboard/lupon/cases/${c.id}`,
                      };
                      router.push(rolePaths[user.role] || `/dashboard`);
                    }}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{c.case_number}</td>
                    <td className="px-6 py-4 text-slate-600">{c.title}</td>
                    <td className="px-6 py-4 text-slate-600">{c.complainant_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{c.respondent_name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[c.status] || ''}`}>
                        {statusLabels[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(c.filing_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
