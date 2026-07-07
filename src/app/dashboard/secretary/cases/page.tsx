'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Case {
  id: number;
  case_number: string;
  title: string;
  status: string;
  complainant_name: string;
  respondent_name: string;
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

export default function SecretaryCasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  function loadCases() {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/cases?${params}`)
      .then((r) => r.json())
      .then((data) => setCases(data.cases || []));
  }

  useEffect(() => { loadCases(); }, [statusFilter]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">All Cases</h1>
        <button
          onClick={() => router.push('/dashboard/secretary/cases/new')}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          + New Case
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && loadCases()}
          placeholder="Search cases..."
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="filed">Filed</option>
          <option value="under_mediation">Under Mediation</option>
          <option value="settled">Settled</option>
          <option value="escalated">Escalated</option>
          <option value="closed">Closed</option>
        </select>
        <button onClick={loadCases} className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600 hover:bg-slate-200">
          Search
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
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
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No cases found</td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="cursor-pointer transition hover:bg-slate-50" onClick={() => router.push(`/dashboard/secretary/cases/${c.id}`)}>
                    <td className="px-6 py-4 font-medium text-slate-900">{c.case_number}</td>
                    <td className="px-6 py-4 text-slate-600">{c.title}</td>
                    <td className="px-6 py-4 text-slate-600">{c.complainant_name || 'Walk-in'}</td>
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
