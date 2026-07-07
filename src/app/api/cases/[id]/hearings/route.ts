import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, createAuditLog, createNotification } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const hearings = await query(
      'SELECT * FROM hearings WHERE case_id = ? ORDER BY hearing_number ASC',
      [id]
    );
    return NextResponse.json({ hearings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hearings' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'secretary') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { scheduled_date, notes } = await req.json();
    if (!scheduled_date) {
      return NextResponse.json({ error: 'Scheduled date is required' }, { status: 400 });
    }

    const count = await query(
      'SELECT COUNT(*) as cnt FROM hearings WHERE case_id = ?',
      [id]
    ) as any[];
    const hearingNumber = count[0].cnt + 1;

    if (hearingNumber > 3) {
      return NextResponse.json({ error: 'Maximum of 3 hearings per case' }, { status: 400 });
    }

    await query(
      'INSERT INTO hearings (case_id, hearing_number, scheduled_date, notes) VALUES (?, ?, ?, ?)',
      [id, hearingNumber, scheduled_date, notes || null]
    );

    const caseData = await query('SELECT case_number, complainant_id, lupon_chairman_id FROM cases WHERE id = ?', [id]) as any[];
    if (caseData.length > 0) {
      const members = await query(
        'SELECT lupon_member_id FROM case_assignments WHERE case_id = ?',
        [id]
      ) as any[];
      const allUsers = [caseData[0].complainant_id, caseData[0].lupon_chairman_id, ...members.map((m: any) => m.lupon_member_id)];
      const uniqueUsers = [...new Set(allUsers.filter(Boolean))];

      for (const userId of uniqueUsers) {
        await createNotification(
          userId,
          'New Hearing Scheduled',
          `Hearing #${hearingNumber} for case ${caseData[0].case_number} has been scheduled on ${new Date(scheduled_date).toLocaleString()}.`
        );
      }
    }

    await createAuditLog(user.id, 'SCHEDULE_HEARING', `Scheduled hearing #${hearingNumber} for case #${id}`);

    return NextResponse.json({ message: 'Hearing scheduled' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to schedule hearing' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'secretary') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { hearing_id, status, notes } = await req.json();

    await query(
      'UPDATE hearings SET status = ?, notes = COALESCE(?, notes) WHERE id = ? AND case_id = ?',
      [status, notes, hearing_id, id]
    );

    await createAuditLog(user.id, 'UPDATE_HEARING', `Updated hearing #${hearing_id} for case #${id}`);

    return NextResponse.json({ message: 'Hearing updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update hearing' }, { status: 500 });
  }
}
