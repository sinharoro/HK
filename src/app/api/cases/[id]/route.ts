import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, createAuditLog } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const cases = await query(
      `SELECT c.*, u.name as complainant_name, l.name as lupon_chairman_name
       FROM cases c
       LEFT JOIN users u ON c.complainant_id = u.id
       LEFT JOIN users l ON c.lupon_chairman_id = l.id
       WHERE c.id = ?`,
      [id]
    ) as any[];

    if (cases.length === 0) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const caseData = cases[0];

    const assignments = await query(
      `SELECT ca.*, u.name as member_name FROM case_assignments ca
       LEFT JOIN users u ON ca.lupon_member_id = u.id
       WHERE ca.case_id = ?`,
      [id]
    );

    return NextResponse.json({ case: caseData, assignments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    if (body.status) {
      const validStatuses = ['filed', 'under_mediation', 'settled', 'escalated', 'closed'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      const settlementDate = body.status === 'settled' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;

      await query(
        'UPDATE cases SET status = ?, settlement_date = ?, remarks = ?, lupon_chairman_id = COALESCE(?, lupon_chairman_id) WHERE id = ?',
        [body.status, settlementDate, body.remarks || null, body.lupon_chairman_id || null, id]
      );

      await createAuditLog(user.id, 'UPDATE_CASE_STATUS', `Updated case #${id} to ${body.status}`);

      if (body.status === 'escalated') {
        const caseRecord = await query('SELECT case_number, title FROM cases WHERE id = ?', [id]) as any[];
        if (caseRecord.length > 0) {
          const chairman = await query(
            'SELECT id FROM users WHERE role = ? LIMIT 1',
            ['lupon_chairman']
          ) as any[];
          if (chairman.length > 0) {
            await query(
              `INSERT INTO filing_reports (case_id, generated_by, report_details) VALUES (?, ?, ?)`,
              [id, user.id, `Case ${caseRecord[0].case_number} (${caseRecord[0].title}) has been escalated after all hearings. Filing of Action report generated.`]
            );
          }
        }
      }
    }

    if (body.lupon_chairman_id && user.role === 'secretary') {
      await query('UPDATE cases SET lupon_chairman_id = ? WHERE id = ?', [body.lupon_chairman_id, id]);
    }

    return NextResponse.json({ message: 'Case updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 });
  }
}
