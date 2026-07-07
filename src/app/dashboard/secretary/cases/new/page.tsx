'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCasePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    respondent_name: '',
    respondent_address: '',
    respondent_contact: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ caseId: number; caseNumber: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess({ caseId: data.caseId, caseNumber: data.case_number });
    } catch {
      setError('Failed to create case');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-4 text-5xl">&#10003;</div>
        <h2 className="mb-2 text-xl font-bold text-green-800">Case Created Successfully!</h2>
        <p className="mb-2 text-green-700">Case Number: <strong>{success.caseNumber}</strong></p>
        <p className="mb-6 text-sm text-green-600">You can now generate summons and manage this case.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => router.push(`/dashboard/secretary/cases/${success.caseId}`)}
            className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-500"
          >
            View Case
          </button>
          <button
            onClick={() => { setSuccess(null); setForm({ title: '', description: '', respondent_name: '', respondent_address: '', respondent_contact: '' }); }}
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">File New Case</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-8">
        <div>
          <label className="block text-sm font-medium text-slate-700">Case Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
        </div>

        <hr className="border-slate-200" />
        <h3 className="text-sm font-semibold text-slate-700">Respondent Information</h3>

        <div>
          <label className="block text-sm font-medium text-slate-700">Respondent Name *</label>
          <input type="text" name="respondent_name" value={form.respondent_name} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Respondent Address</label>
          <textarea name="respondent_address" value={form.respondent_address} onChange={handleChange} rows={2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Respondent Contact (Email or Phone)</label>
          <input type="text" name="respondent_contact" value={form.respondent_contact} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Case'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
