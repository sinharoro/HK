import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, createAuditLog } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const reports = await query(
      `SELECT fr.*, u.name as generated_by_name
       FROM filing_reports fr
       LEFT JOIN users u ON fr.generated_by = u.id
       WHERE fr.case_id = ? ORDER BY fr.created_at DESC`,
      [id]
    );
    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const caseData = await query(
      `SELECT c.*, u.name as complainant_name
       FROM cases c LEFT JOIN users u ON c.complainant_id = u.id
       WHERE c.id = ?`,
      [id]
    ) as any[];

    if (caseData.length === 0) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const c = caseData[0];
    const hearings = await query(
      'SELECT * FROM hearings WHERE case_id = ? ORDER BY hearing_number',
      [id]
    ) as any[];

    const reportDetails = JSON.stringify({
      case_number: c.case_number,
      title: c.title,
      complainant: c.complainant_name,
      respondent: c.respondent_name,
      filing_date: c.filing_date,
      status: c.status,
      hearings: hearings.map((h: any) => ({
        number: h.hearing_number,
        date: h.scheduled_date,
        status: h.status,
        notes: h.notes,
      })),
    });

    await query(
      'INSERT INTO filing_reports (case_id, generated_by, report_details) VALUES (?, ?, ?)',
      [id, user.id, reportDetails]
    );

    await query("UPDATE cases SET status = 'escalated' WHERE id = ? AND status != 'settled' AND status != 'closed'", [id]);

    await createAuditLog(user.id, 'GENERATE_REPORT', `Generated Filing of Action report for case ${c.case_number}`);

    return NextResponse.json({ message: 'Filing of Action report generated', report: reportDetails });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
