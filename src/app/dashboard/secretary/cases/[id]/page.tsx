'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface CaseDetail {
  id: number;
  case_number: string;
  title: string;
  description: string | null;
  complainant_id: number;
  complainant_name: string;
  respondent_name: string;
  respondent_address: string | null;
  respondent_contact: string | null;
  respondent_password: string | null;
  status: string;
  lupon_chairman_id: number | null;
  lupon_chairman_name: string | null;
  filing_date: string;
  settlement_date: string | null;
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

interface Summon {
  id: number;
  status: string;
  respondent_credentials: string | null;
  generated_by_name: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
}

interface Report {
  id: number;
  report_details: string;
  generated_by_name: string;
  created_at: string;
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

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [summons, setSummons] = useState<Summon[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [luponMembers, setLuponMembers] = useState<User[]>([]);
  const [tab, setTab] = useState<'overview' | 'hearings' | 'summons' | 'attendance' | 'reports'>('overview');

  // Modal states
  const [showHearingModal, setShowHearingModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSummonModal, setShowSummonModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedHearing, setSelectedHearing] = useState<number | null>(null);
  const [summonResult, setSummonResult] = useState<any>(null);
  const [generatingSummon, setGeneratingSummon] = useState(false);

  // Form states
  const [hearingDate, setHearingDate] = useState('');
  const [hearingNotes, setHearingNotes] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedRole, setSelectedRole] = useState<'member' | 'pangkat'>('member');
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  function loadData() {
    fetch(`/api/cases/${id}`).then(r => r.json()).then(data => {
      setCaseData(data.case);
      setAssignments(data.assignments || []);
    });
    fetch(`/api/cases/${id}/hearings`).then(r => r.json()).then(data => setHearings(data.hearings || []));
    fetch(`/api/cases/${id}/summons`).then(r => r.json()).then(data => setSummons(data.summons || []));
    fetch(`/api/cases/${id}/attendance`).then(r => r.json()).then(data => setAttendance(data.attendance || []));
    fetch(`/api/cases/${id}/report`).then(r => r.json()).then(data => setReports(data.reports || []));
    fetch('/api/users?role=lupon_member').then(r => r.json()).then(data => setLuponMembers(data.users || []));
  }

  useEffect(() => { loadData(); }, [id]);

  async function scheduleHearing(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/cases/${id}/hearings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduled_date: hearingDate, notes: hearingNotes }),
    });
    if (res.ok) { setShowHearingModal(false); setHearingDate(''); setHearingNotes(''); loadData(); }
  }

  async function assignMember(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/cases/${id}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lupon_member_id: parseInt(selectedMember), role: selectedRole }),
    });
    if (res.ok) { setShowAssignModal(false); setSelectedMember(''); loadData(); }
  }

  async function generateSummon() {
    setGeneratingSummon(true);
    const res = await fetch(`/api/cases/${id}/summons`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setSummonResult(data);
      setShowSummonModal(true);
      loadData();
    }
    setGeneratingSummon(false);
  }

  async function updateStatus(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/cases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, remarks }),
    });
    if (res.ok) { setShowStatusModal(false); setNewStatus(''); setRemarks(''); loadData(); }
  }

  async function updateHearingStatus(hearingId: number, status: string) {
    await fetch(`/api/cases/${id}/hearings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hearing_id: hearingId, status }),
    });
    loadData();
  }

  async function markAttendance(hearingId: number, userId: number, role: string, attended: boolean) {
    const records = [{ user_id: userId, role, attended }];
    const existing = attendance.filter(a => a.hearing_id === hearingId);
    for (const e of existing) {
      if (!records.find(r => r.user_id === e.user_id)) {
        records.push({ user_id: e.user_id, role: e.role, attended: e.attended === 1 });
      }
    }
    await fetch(`/api/cases/${id}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hearing_id: hearingId, records }),
    });
    loadData();
  }

  async function generateReport() {
    if (!confirm('Generate Filing of Action report? This will escalate the case.')) return;
    const res = await fetch(`/api/cases/${id}/report`, { method: 'POST' });
    if (res.ok) loadData();
  }

  function printSummon(data: any) {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Summon - ${data.case_number}</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 40px; max-width: 800px; margin: auto; }
        h1 { text-align: center; font-size: 24px; margin-bottom: 5px; }
        h2 { text-align: center; font-size: 18px; margin-bottom: 30px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px; }
        .content { line-height: 2; font-size: 14px; text-align: justify; }
        .credentials { margin-top: 30px; padding: 15px; border: 1px dashed #666; }
        .footer { margin-top: 50px; text-align: right; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        td { padding: 8px; border: 1px solid #000; }
        .label { font-weight: bold; width: 150px; }
      </style></head><body>
      <div class="header">
        <h1>Republic of the Philippines</h1>
        <h2>Barangay Napolan, Pagadian City, Zamboanga del Sur</h2>
        <h3 style="margin-top:20px;">OFFICE OF THE LUPONG TAGAPAMAYAPA</h3>
        <h4>SUMMONS</h4>
        <p><strong>Case No.: ${data.case_number}</strong></p>
      </div>
      <div class="content">
        <p><strong>TO: ${data.respondent_name}</strong></p>
        <p>${data.respondent_address || ''}</p>
        <p style="margin-top:20px;">You are hereby summoned to appear before the Lupon Tagapamayapa of Barangay Napolan for a hearing regarding the complaint filed against you.</p>
        <p>Failure to appear on the scheduled date shall be construed as waiver of your right to present your defense.</p>
      </div>
      <div class="credentials">
        <p><strong>Respondent Login Credentials:</strong></p>
        <p>Login to <strong>HUSTISYAKONEK</strong> at the Barangay Hall to view your case details.</p>
        <p>Use your email/contact as username and the following password: <strong>${data.respondent_password}</strong></p>
      </div>
      <div class="footer">
        <p>___________________________</p>
        <p><strong>MARIA SANTOS</strong></p>
        <p>Barangay Secretary</p>
      </div>
      <p style="text-align:center;margin-top:30px;font-size:11px;">This document was generated by HUSTISYAKONEK System on ${new Date().toLocaleString()}</p>
    </body></html>`);
    win.document.close();
    win.print();
  }

  if (!caseData) return <div className="text-slate-500">Loading case...</div>;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'hearings', label: `Hearings (${hearings.length})` },
    { key: 'summons', label: `Summons (${summons.length})` },
    { key: 'attendance', label: 'Attendance' },
    { key: 'reports', label: 'Reports' },
  ] as const;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-slate-500">
        <button onClick={() => router.push('/dashboard/secretary/cases')} className="hover:text-slate-700">Cases</button>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{caseData.case_number}</span>
      </div>

      {/* Case Header */}
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
        {caseData.description && (
          <p className="mt-3 text-sm text-slate-600">{caseData.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setShowStatusModal(true)} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700">
            Update Status
          </button>
          <button onClick={generateSummon} disabled={generatingSummon} className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500 disabled:opacity-50">
            {generatingSummon ? 'Generating...' : 'Generate Summon'}
          </button>
          <button onClick={() => setShowHearingModal(true)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500">
            Schedule Hearing
          </button>
          <button onClick={() => setShowAssignModal(true)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Assign Member
          </button>
          {caseData.status !== 'settled' && caseData.status !== 'closed' && hearings.length >= 3 && (
            <button onClick={generateReport} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500">
              Generate Filing of Action Report
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Case Information</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr><td className="py-2 text-slate-500">Title</td><td className="py-2 text-slate-900">{caseData.title}</td></tr>
                <tr><td className="py-2 text-slate-500">Case No.</td><td className="py-2 text-slate-900">{caseData.case_number}</td></tr>
                <tr><td className="py-2 text-slate-500">Status</td><td className="py-2">{statusLabels[caseData.status]}</td></tr>
                <tr><td className="py-2 text-slate-500">Complainant</td><td className="py-2 text-slate-900">{caseData.complainant_name || 'Walk-in'}</td></tr>
                <tr><td className="py-2 text-slate-500">Respondent</td><td className="py-2 text-slate-900">{caseData.respondent_name}</td></tr>
                <tr><td className="py-2 text-slate-500">Respondent Contact</td><td className="py-2 text-slate-900">{caseData.respondent_contact || 'N/A'}</td></tr>
                <tr><td className="py-2 text-slate-500">Filing Date</td><td className="py-2 text-slate-900">{new Date(caseData.filing_date).toLocaleDateString()}</td></tr>
                {caseData.settlement_date && <tr><td className="py-2 text-slate-500">Settlement Date</td><td className="py-2 text-slate-900">{new Date(caseData.settlement_date).toLocaleDateString()}</td></tr>}
                {caseData.remarks && <tr><td className="py-2 text-slate-500">Remarks</td><td className="py-2 text-slate-900">{caseData.remarks}</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Assigned Lupon Members</h3>
            {assignments.length === 0 ? (
              <p className="text-sm text-slate-400">No members assigned yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-slate-500"><th className="py-2 text-left font-medium">Name</th><th className="py-2 text-left font-medium">Role</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {assignments.map((a) => (
                    <tr key={a.id}><td className="py-2 text-slate-900">{a.member_name}</td><td className="py-2 text-slate-600 capitalize">{a.role}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
            {caseData.lupon_chairman_name && (
              <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-500">Lupon Chairman</p>
                <p className="text-sm font-medium text-blue-800">{caseData.lupon_chairman_name}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'hearings' && (
        <div className="space-y-4">
          {hearings.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              No hearings scheduled yet.
            </div>
          ) : (
            hearings.map((h) => (
              <div key={h.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">Hearing #{h.hearing_number}</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(h.scheduled_date).toLocaleString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    h.status === 'completed' ? 'bg-green-100 text-green-800' :
                    h.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                  </span>
                </div>
                {h.notes && <p className="mt-2 text-sm text-slate-600">{h.notes}</p>}
                <div className="mt-3 flex gap-2">
                  {h.status === 'scheduled' && (
                    <>
                      <button onClick={() => updateHearingStatus(h.id, 'completed')} className="rounded bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100">Mark Completed</button>
                      <button onClick={() => updateHearingStatus(h.id, 'cancelled')} className="rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100">Cancel</button>
                      <button onClick={() => { setSelectedHearing(h.id); setShowAttendanceModal(true); }} className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">Attendance</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'summons' && (
        <div className="space-y-4">
          {summons.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              No summons generated yet.
            </div>
          ) : (
            summons.map((s) => (
              <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Summon #{s.id}</p>
                    <p className="text-xs text-slate-500">Generated by {s.generated_by_name} on {new Date(s.created_at).toLocaleString()}</p>
                    {s.respondent_credentials && (
                      <p className="mt-2 text-xs text-slate-600">{s.respondent_credentials}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 capitalize">{s.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'attendance' && (
        <div className="space-y-6">
          {hearings.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              No hearings to record attendance for.
            </div>
          ) : (
            hearings.map((h) => {
              const hAttendance = attendance.filter(a => a.hearing_id === h.id);
              return (
                <div key={h.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <h4 className="mb-3 font-semibold text-slate-900">Hearing #{h.hearing_number} - {new Date(h.scheduled_date).toLocaleDateString()}</h4>
                  {hAttendance.length === 0 ? (
                    <p className="text-sm text-slate-400">No attendance recorded.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead><tr className="text-xs text-slate-500"><th className="py-2 text-left font-medium">Name</th><th className="py-2 text-left font-medium">Role</th><th className="py-2 text-left font-medium">Status</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {hAttendance.map((a) => (
                          <tr key={a.id}>
                            <td className="py-2 text-slate-900">{a.user_name}</td>
                            <td className="py-2 capitalize text-slate-600">{a.role}</td>
                            <td className="py-2">
                              <span className={`text-xs font-medium ${a.attended ? 'text-green-600' : 'text-red-600'}`}>
                                {a.attended ? 'Present' : 'Absent'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              No reports generated. Escalate the case to the PNP to generate a Filing of Action report.
            </div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <h4 className="font-semibold text-slate-900">Filing of Action Report</h4>
                <p className="text-xs text-slate-500">Generated by {r.generated_by_name} on {new Date(r.created_at).toLocaleString()}</p>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-xs text-slate-700">{r.report_details}</pre>
              </div>
            ))
          )}
        </div>
      )}

      {/* Schedule Hearing Modal */}
      {showHearingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowHearingModal(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6" onClick={e => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Schedule Hearing</h3>
            <form onSubmit={scheduleHearing} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Date & Time *</label>
                <input type="datetime-local" value={hearingDate} onChange={e => setHearingDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Notes</label>
                <textarea value={hearingNotes} onChange={e => setHearingNotes(e.target.value)} rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowHearingModal(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Member Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowAssignModal(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6" onClick={e => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Assign Lupon Member</h3>
            <form onSubmit={assignMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Member *</label>
                <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none" required>
                  <option value="">Select member...</option>
                  {luponMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Role</label>
                <select value={selectedRole} onChange={e => setSelectedRole(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none">
                  <option value="member">Member</option>
                  <option value="pangkat">Pangkat Tagapagkasundo</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAssignModal(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowStatusModal(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6" onClick={e => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Update Case Status</h3>
            <form onSubmit={updateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Status *</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none" required>
                  <option value="">Select status...</option>
                  <option value="under_mediation">Under Mediation</option>
                  <option value="settled">Settled</option>
                  <option value="escalated">Escalated</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Remarks</label>
                <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowStatusModal(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Summon Result Modal */}
      {showSummonModal && summonResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowSummonModal(false)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-6" onClick={e => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Summon Generated</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Case No.:</strong> {summonResult.case_number}</p>
              <p><strong>Respondent:</strong> {summonResult.respondent_name}</p>
              <p><strong>Respondent Password:</strong> <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-blue-700">{summonResult.respondent_password}</code></p>
              <p className="text-xs text-slate-500">Provide this password to the respondent along with the printed summon slip so they can log in to view their case.</p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { printSummon(summonResult); }} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500">Print Summon</button>
              <button onClick={() => setShowSummonModal(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && selectedHearing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => { setShowAttendanceModal(false); setSelectedHearing(null); }}>
          <div className="w-full max-w-md rounded-xl bg-white p-6" onClick={e => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Mark Attendance - Hearing #{hearings.find(h => h.id === selectedHearing)?.hearing_number}</h3>
            <p className="mb-4 text-sm text-slate-500">Toggle attendance for each party:</p>
            <div className="space-y-3">
              {[
                { label: `Complainant: ${caseData.complainant_name || 'Walk-in'}`, userId: caseData.complainant_id, role: 'complainant' },
                { label: `Respondent: ${caseData.respondent_name}`, userId: 0, role: 'respondent' },
                ...assignments.map(a => ({ label: `Lupon: ${a.member_name}`, userId: a.lupon_member_id, role: 'lupon_member' })),
              ].filter(p => p.userId).map((person) => {
                const att = attendance.find(a => a.hearing_id === selectedHearing && a.user_id === person.userId);
                const isPresent = att ? att.attended === 1 : false;
                return (
                  <div key={person.userId} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <span className="text-sm text-slate-700">{person.label}</span>
                    <button
                      onClick={() => markAttendance(selectedHearing, person.userId, person.role, !isPresent)}
                      className={`rounded px-3 py-1 text-xs font-medium ${isPresent ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {isPresent ? 'Present' : 'Absent'}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => { setShowAttendanceModal(false); setSelectedHearing(null); }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
