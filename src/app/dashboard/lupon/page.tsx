'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CaseItem {
  id: number;
  case_number: string;
  title: string;
  status: string;
  complainant_name: string;
  respondent_name: string;
  filing_date: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

const statusColors: Record<string, string> = {
  filed: 'bg-yellow-100 text-yellow-800', under_mediation: 'bg-blue-100 text-blue-800',
  settled: 'bg-green-100 text-green-800', escalated: 'bg-red-100 text-red-800', closed: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  filed: 'Filed', under_mediation: 'Under Mediation', settled: 'Settled', escalated: 'Escalated', closed: 'Closed',
};

const roleLabels: Record<string, string> = {
  secretary: 'Barangay Secretary', lupon_chairman: 'Lupon Chairman', lupon_member: 'Lupon Member',
  complainant: 'Complainant', respondent: 'Respondent',
};

export default function LuponDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      if (data.user) setUser(data.user);
      else router.push('/login');
    });
    fetch('/api/cases').then(r => r.json()).then(data => setCases(data.cases || []));
  }, [router]);

  if (!user) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user.name}</h1>
        <p className="text-slate-500">{roleLabels[user.role]}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {user.role === 'lupon_chairman' ? 'All Cases' : 'My Assigned Cases'}
          </h2>
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
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No cases found</td></tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="cursor-pointer transition hover:bg-slate-50"
                    onClick={() => router.push(`/dashboard/lupon/cases/${c.id}`)}>
                    <td className="px-6 py-4 font-medium text-slate-900">{c.case_number}</td>
                    <td className="px-6 py-4 text-slate-600">{c.title}</td>
                    <td className="px-6 py-4 text-slate-600">{c.complainant_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{c.respondent_name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[c.status] || ''}`}>
                        {statusLabels[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(c.filing_date).toLocaleDateString()}</td>
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
