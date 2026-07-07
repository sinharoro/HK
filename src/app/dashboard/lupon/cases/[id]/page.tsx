'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface CaseDetail {
  id: number;
  case_number: string;
  title: string;
  description: string | null;
  complainant_name: string;
  respondent_name: string;
  respondent_address: string | null;
  status: string;
  lupon_chairman_name: string | null;
  filing_date: string;
  remarks: string | null;
}

interface Hearing {
  id: number;
  hearing_number: number;
  scheduled_date: string;
  status: string;
  notes: string | null;
}

interface Assignment {
  id: number;
  lupon_member_id: number;
  member_name: string;
  role: string;
}

interface Attendance {
  id: number;
  hearing_id: number;
  user_id: number;
  user_name: string;
  role: string;
  attended: number;
}

const statusLabels: Record<string, string> = {
  filed: 'Filed', under_mediation: 'Under Mediation', settled: 'Settled', escalated: 'Escalated', closed: 'Closed',
};

const statusColors: Record<string, string> = {
  filed: 'bg-yellow-100 text-yellow-800', under_mediation: 'bg-blue-100 text-blue-800',
  settled: 'bg-green-100 text-green-800', escalated: 'bg-red-100 text-red-800', closed: 'bg-gray-100 text-gray-800',
};

export default function LuponCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    fetch(`/api/cases/${id}`).then(r => r.json()).then(data => {
      setCaseData(data.case);
      setAssignments(data.assignments || []);
    });
    fetch(`/api/cases/${id}/hearings`).then(r => r.json()).then(data => setHearings(data.hearings || []));
    fetch(`/api/cases/${id}/attendance`).then(r => r.json()).then(data => setAttendance(data.attendance || []));
  }, [id]);

  if (!caseData) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <button onClick={() => router.push('/dashboard')} className="mb-4 text-sm text-blue-600 hover:text-blue-500">&larr; Back to Dashboard</button>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{caseData.title}</h1>
            <p className="mt-1 text-sm text-slate-500">Case No. {caseData.case_number}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[caseData.status]}`}>
            {statusLabels[caseData.status]}
          </span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-400">Complainant</p>
            <p className="text-sm font-medium text-slate-900">{caseData.complainant_name || 'Walk-in'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Respondent</p>
            <p className="text-sm font-medium text-slate-900">{caseData.respondent_name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Filed</p>
            <p className="text-sm font-medium text-slate-900">{new Date(caseData.filing_date).toLocaleDateString()}</p>
          </div>
        </div>
        {caseData.description && <p className="mt-3 text-sm text-slate-600">{caseData.description}</p>}
        {caseData.lupon_chairman_name && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <p className="text-xs text-blue-500">Lupon Chairman</p>
            <p className="text-sm font-medium text-blue-800">{caseData.lupon_chairman_name}</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Assigned Members</h3>
          {assignments.length === 0 ? (
            <p className="text-sm text-slate-400">No members assigned.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-slate-500"><th className="py-2 text-left font-medium">Name</th><th className="py-2 text-left font-medium">Role</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map(a => (
                  <tr key={a.id}><td className="py-2 text-slate-900">{a.member_name}</td><td className="py-2 capitalize text-slate-600">{a.role}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Hearings</h3>
          {hearings.length === 0 ? (
            <p className="text-sm text-slate-400">No hearings scheduled.</p>
          ) : (
            <div className="space-y-3">
              {hearings.map(h => {
                const hAttendance = attendance.filter(a => a.hearing_id === h.id);
                return (
                  <div key={h.id} className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900">Hearing #{h.hearing_number}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        h.status === 'completed' ? 'bg-green-100 text-green-800' :
                        h.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>{h.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{new Date(h.scheduled_date).toLocaleString()}</p>
                    {h.notes && <p className="mt-1 text-xs text-slate-600">{h.notes}</p>}
                    {hAttendance.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {hAttendance.map(a => (
                          <span key={a.id} className={`rounded px-2 py-0.5 text-xs ${a.attended ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {a.user_name}: {a.attended ? 'Present' : 'Absent'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
